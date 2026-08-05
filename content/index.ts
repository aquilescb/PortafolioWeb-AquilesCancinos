// The only module `app/**` may import content through. Components never
// reach into `content/data/*` directly (enforced by an ESLint rule); they
// call these functions instead. Migrating to a CMS/API later means
// reimplementing these functions as async — callers stay the same.
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { contact } from "./data/contact";
import { education } from "./data/education";
import { experiences } from "./data/experience";
import { milestones } from "./data/milestones";
import { projects } from "./data/projects";
import { technologies } from "./data/technologies";
import {
  getStaticPaths,
  milestoneDetailPath,
  projectDetailPath,
} from "./i18n/route-map";
import { LOCALES, type Locale } from "./i18n/locale";
import type { SocialLink } from "./schemas/contact";
import type { Education } from "./schemas/education";
import type { Experience } from "./schemas/experience";
import type { Milestone } from "./schemas/milestone";
import type { Project, ProjectContext } from "./schemas/project";
import type { Technology } from "./schemas/technology";

export interface ProjectSummary {
  slug: string;
  title: string;
  summary: string;
  year: number;
  tier: Project["tier"];
  context: ProjectContext;
  categories: string[];
  visibility: Project["visibility"];
  cover: string;
  technologies: Technology[];
  featuredOrder?: number;
}

export interface ProjectDetail extends ProjectSummary {
  problem: string;
  role: string;
  duration?: string;
  organization?: string;
  teamSize?: number;
  status: Project["status"];
  repositoryUrl?: string;
  demoUrl?: string;
  screenshots: string[];
  videoId?: string;
  hasCaseStudy: boolean;
}

export interface ProjectFilter {
  technology?: string;
  year?: number;
  context?: ProjectContext;
  category?: string;
}

export interface ContactSocialLink {
  url: string;
  label: string;
  kind: SocialLink["kind"];
}

export interface ContactInfo {
  // Split rather than a single `email` field: with `ssr:false` prerender,
  // the whole loader return value is serialized into the page's hydration
  // payload verbatim, regardless of how the component chooses to render it
  // — so a single joined string here would still ship the plain address in
  // the static HTML even though the rendered DOM only ever shows an
  // obfuscated label (see `~/components/content/contact-email.tsx`).
  emailUser: string;
  emailDomain: string;
  socials: ContactSocialLink[];
  location?: string;
  availability?: string;
}

// A singleton read, unlike the project functions above — there's exactly
// one Contact for the site (see `content/schemas/contact.ts`).
export function getContact(locale: Locale): ContactInfo {
  const [emailUser = "", emailDomain = ""] = contact.email.split("@");

  return {
    emailUser,
    emailDomain,
    socials: contact.socials.map((social) => ({
      url: social.url,
      label: social.label[locale],
      kind: social.kind,
    })),
    location: contact.location?.[locale],
    availability: contact.availability?.[locale],
  };
}

function resolveTechnologies(refs: Project["technologies"]): Technology[] {
  const bySlug = new Map(
    technologies.map((technology) => [technology.slug, technology]),
  );
  return refs
    .map((ref) => bySlug.get(ref.slug))
    .filter((technology): technology is Technology => technology !== undefined);
}

function toSummary(project: Project, locale: Locale): ProjectSummary {
  return {
    slug: project.slug,
    title: project.title[locale],
    summary: project.summary[locale],
    year: project.year,
    tier: project.tier,
    context: project.context,
    categories: project.categories,
    visibility: project.visibility,
    cover: project.cover,
    technologies: resolveTechnologies(project.technologies),
    featuredOrder: project.featuredOrder,
  };
}

function matchesFilter(project: Project, filter?: ProjectFilter): boolean {
  if (!filter) return true;
  if (
    filter.technology &&
    !project.technologies.some((ref) => ref.slug === filter.technology)
  ) {
    return false;
  }
  if (filter.year !== undefined && project.year !== filter.year) return false;
  if (filter.context && project.context !== filter.context) return false;
  if (filter.category && !project.categories.includes(filter.category))
    return false;
  return true;
}

// `app/routes.ts` reads this at route-config time to decide whether to
// register the project detail route at all. With `ssr:false`, React Router
// errors at build time if a route exports a `loader` but matches zero
// prerender paths — which is exactly the state of project detail while no
// real project has been loaded yet (see the plan's §18 and Phase 4 notes).
export function hasProjects(): boolean {
  return projects.length > 0;
}

// The home page shows exactly three featured projects, ordered by
// `featuredOrder` (see CLAUDE.md content rules).
export function getFeaturedProjects(locale: Locale): ProjectSummary[] {
  return projects
    .filter((project) => project.tier === "featured")
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0))
    .map((project) => toSummary(project, locale));
}

export function getAllProjects(
  locale: Locale,
  filter?: ProjectFilter,
): ProjectSummary[] {
  return projects
    .filter((project) => matchesFilter(project, filter))
    .map((project) => toSummary(project, locale));
}

export function getProjectBySlug(
  slug: string,
  locale: Locale,
): ProjectDetail | null {
  const project = projects.find((candidate) => candidate.slug === slug);
  if (!project) return null;

  return {
    ...toSummary(project, locale),
    problem: project.problem[locale],
    role: project.role[locale],
    duration: project.duration?.[locale],
    organization: project.organization,
    teamSize: project.teamSize,
    status: project.status,
    repositoryUrl: project.repositoryUrl,
    demoUrl: project.demoUrl,
    screenshots: project.screenshots,
    videoId: project.videoId,
    hasCaseStudy: project.caseStudy !== undefined,
  };
}

function resolveProjects(
  refs: Milestone["relatedProjects"],
  locale: Locale,
): ProjectSummary[] {
  const bySlug = new Map(projects.map((project) => [project.slug, project]));
  return refs
    .map((ref) => bySlug.get(ref.slug))
    .filter((project): project is Project => project !== undefined)
    .map((project) => toSummary(project, locale));
}

export interface MilestoneEvidenceLink {
  url: string;
  label: string;
  kind: Milestone["evidence"][number]["kind"];
  publisher?: string;
  date?: string;
}

export interface MilestoneDetail {
  slug: string;
  title: string;
  type: Milestone["type"];
  date: string;
  organization?: string;
  summary: string;
  evidence: MilestoneEvidenceLink[];
  videoId?: string;
  relatedProjects: ProjectSummary[];
  hasBody: boolean;
}

// `app/routes.ts` reads this at route-config time, mirroring `hasProjects`:
// with `ssr:false`, a route with a `loader` must be matched by at least one
// prerender path, which is impossible while no milestone declares
// `hasOwnPage: true`.
export function hasMilestonePages(): boolean {
  return milestones.some((milestone) => milestone.hasOwnPage);
}

export function getMilestoneBySlug(
  slug: string,
  locale: Locale,
): MilestoneDetail | null {
  const milestone = milestones.find((candidate) => candidate.slug === slug);
  if (!milestone) return null;

  return {
    slug: milestone.slug,
    title: milestone.title[locale],
    type: milestone.type,
    date: milestone.date,
    organization: milestone.organization,
    summary: milestone.summary[locale],
    evidence: milestone.evidence.map((link) => ({
      url: link.url,
      label: link.label[locale],
      kind: link.kind,
      publisher: link.publisher,
      date: link.date,
    })),
    videoId: milestone.videoId,
    relatedProjects: resolveProjects(milestone.relatedProjects, locale),
    hasBody: milestone.body !== undefined,
  };
}

export type CareerEntryType = "experience" | "education" | "milestone";

// A common shape for the unified `/trayectoria` timeline, so the route and
// its components render Experience/Education/Milestone without knowing
// which is which beyond `type` and the badge/link it implies.
export interface CareerEntry {
  type: CareerEntryType;
  slug: string;
  title: string;
  organization?: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  // Only meaningful for milestones — whether `/hitos/:slug` exists for it.
  hasOwnPage?: boolean;
}

export interface CareerFilter {
  type?: CareerEntryType;
}

function experienceToEntry(experience: Experience, locale: Locale): CareerEntry {
  return {
    type: "experience",
    slug: experience.slug,
    title: experience.role[locale],
    organization: experience.organization,
    startDate: experience.startDate,
    endDate: experience.endDate,
  };
}

function educationToEntry(entry: Education, locale: Locale): CareerEntry {
  return {
    type: "education",
    slug: entry.slug,
    title: entry.degree[locale],
    organization: entry.institution,
    startDate: entry.startDate,
    endDate: entry.endDate,
  };
}

function milestoneToEntry(milestone: Milestone, locale: Locale): CareerEntry {
  return {
    type: "milestone",
    slug: milestone.slug,
    title: milestone.title[locale],
    organization: milestone.organization,
    startDate: milestone.date,
    summary: milestone.summary[locale],
    hasOwnPage: milestone.hasOwnPage,
  };
}

// An experience/education entry with no `endDate` is ongoing ("present") and
// sorts first, ahead of anything with a real end date. A milestone always
// has a single fixed `date` (its `startDate` here), not an open span.
function timelineSortKey(entry: CareerEntry): string {
  if (entry.type === "milestone") return entry.startDate;
  return entry.endDate ?? "9999-12";
}

export function getCareerTimeline(
  locale: Locale,
  filter?: CareerFilter,
): CareerEntry[] {
  const entries: CareerEntry[] = [
    ...experiences.map((entry) => experienceToEntry(entry, locale)),
    ...education.map((entry) => educationToEntry(entry, locale)),
    ...milestones.map((entry) => milestoneToEntry(entry, locale)),
  ];

  const visible = filter?.type
    ? entries.filter((entry) => entry.type === filter.type)
    : entries;

  return visible.sort((a, b) =>
    timelineSortKey(b).localeCompare(timelineSortKey(a)),
  );
}

// Every static path the prerenderer needs, both locales: the fixed routes
// in `routeMap` plus one project detail path per project per locale, plus
// one milestone detail path per milestone with `hasOwnPage`. The same list
// feeds `scripts/generate-sitemap.ts`, so prerender output and the sitemap
// can never drift apart.
export function getAllPrerenderPaths(): string[] {
  const projectPaths = LOCALES.flatMap((locale) =>
    projects.map((project) => projectDetailPath(project.slug, locale)),
  );
  const milestonePaths = LOCALES.flatMap((locale) =>
    milestones
      .filter((milestone) => milestone.hasOwnPage)
      .map((milestone) => milestoneDetailPath(milestone.slug, locale)),
  );
  return [...getStaticPaths(), ...projectPaths, ...milestonePaths];
}

const caseStudiesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "case-studies",
);

// Node-safe existence check (no bundler required) — used by both
// `getCaseStudy` below and the `validate:content` script, which runs outside
// Vite and can't rely on dynamic MDX imports resolving.
export function caseStudyFileExists(slug: string, locale: Locale): boolean {
  return existsSync(join(caseStudiesDir, slug, `${locale}.mdx`));
}

export interface CaseStudyResult {
  Component: Awaited<ReturnType<typeof importCaseStudy>>;
  locale: Locale;
  isFallback: boolean;
}

interface ResolvedCaseStudyLocale {
  locale: Locale;
  isFallback: boolean;
}

// Pure decision logic, independent of the filesystem and the MDX loader, so
// the fallback behaviour is unit-testable without real `.mdx` files: prefer
// the requested locale, fall back to the other one when only it exists (per
// the plan's §6.3 translation fallback), or give up when neither resolves.
export function resolveCaseStudyLocale(
  declared: { es: boolean; en: boolean } | undefined,
  requestedLocale: Locale,
  fileExists: (locale: Locale) => boolean,
): ResolvedCaseStudyLocale | null {
  if (!declared) return null;

  const otherLocale: Locale = requestedLocale === "es" ? "en" : "es";
  const preferredLocale = declared[requestedLocale]
    ? requestedLocale
    : otherLocale;
  if (!declared[preferredLocale] || !fileExists(preferredLocale)) return null;

  return {
    locale: preferredLocale,
    isFallback: preferredLocale !== requestedLocale,
  };
}

async function importCaseStudy(slug: string, locale: Locale) {
  const module = await import(`./case-studies/${slug}/${locale}.mdx`);
  return module.default;
}

// Loads a project's case study MDX for the requested locale, falling back to
// the other locale when only one is declared. Returns null when the project
// has no case study at all.
export async function getCaseStudy(
  slug: string,
  locale: Locale,
): Promise<CaseStudyResult | null> {
  const project = projects.find((candidate) => candidate.slug === slug);
  const resolved = resolveCaseStudyLocale(
    project?.caseStudy,
    locale,
    (candidate) => caseStudyFileExists(slug, candidate),
  );
  if (!resolved) return null;

  return {
    Component: await importCaseStudy(slug, resolved.locale),
    locale: resolved.locale,
    isFallback: resolved.isFallback,
  };
}

const milestonesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "milestones",
);

export function milestoneBodyFileExists(slug: string, locale: Locale): boolean {
  return existsSync(join(milestonesDir, slug, `${locale}.mdx`));
}

async function importMilestoneBody(slug: string, locale: Locale) {
  const module = await import(`./milestones/${slug}/${locale}.mdx`);
  return module.default;
}

// Loads a milestone's MDX body for the requested locale, falling back to the
// other locale when only one is declared — same shape and fallback rules as
// `getCaseStudy` above.
export async function getMilestoneBody(
  slug: string,
  locale: Locale,
): Promise<CaseStudyResult | null> {
  const milestone = milestones.find((candidate) => candidate.slug === slug);
  const resolved = resolveCaseStudyLocale(
    milestone?.body,
    locale,
    (candidate) => milestoneBodyFileExists(slug, candidate),
  );
  if (!resolved) return null;

  return {
    Component: await importMilestoneBody(slug, resolved.locale),
    locale: resolved.locale,
    isFallback: resolved.isFallback,
  };
}
