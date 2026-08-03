// The only module `app/**` may import content through. Components never
// reach into `content/data/*` directly (enforced by an ESLint rule); they
// call these functions instead. Migrating to a CMS/API later means
// reimplementing these functions as async — callers stay the same.
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { projects } from "./data/projects";
import { technologies } from "./data/technologies";
import { getStaticPaths } from "./i18n/route-map";
import type { Locale } from "./i18n/locale";
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

// Every static path the prerenderer needs, both locales. Content-driven
// paths (project detail pages) are added here once Phase 4 introduces the
// route that renders them; for now this simply re-exports the locale route
// map so `react-router.config.ts` has a single, stable import to depend on.
export function getAllPrerenderPaths(): string[] {
  return getStaticPaths();
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
