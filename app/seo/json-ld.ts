import type { MetaDescriptor } from "react-router";
import { dictionaries } from "@content/i18n/dictionaries";
import type { Locale } from "@content/i18n/locale";
import {
  localizedPath,
  milestoneDetailPath,
  projectDetailPath,
} from "@content/i18n/route-map";
import { absoluteUrl } from "./site";

const SITE_NAME = "Aquiles Cancinos";

interface RootMetaMatch {
  id: string;
  meta: MetaDescriptor[];
}

// React Router's default meta merging only inherits a parent route's `meta`
// when the child doesn't define its own (see the framework's `Meta`
// component) — every leaf route here exports its own `meta`, so root's
// Person/WebSite JSON-LD would otherwise be silently dropped on every real
// page. Leaf routes call this with their `matches` argument to pull root's
// already-computed meta tags back in explicitly.
export function globalMetaTags(
  matches: (RootMetaMatch | undefined)[],
): MetaDescriptor[] {
  return matches.find((match) => match?.id === "root")?.meta ?? [];
}

interface ContactLike {
  socials: { url: string }[];
}

// Global, rendered on every page from `app/root.tsx` — one Person for the
// whole site. No email here on purpose: it would undo the obfuscation work
// in `~/components/content/contact-email.tsx` (see that file's comment).
export function personJsonLd(locale: Locale, contact: ContactLike) {
  const t = dictionaries[locale];

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    jobTitle: t.about.role,
    url: absoluteUrl(localizedPath("home", locale)),
    sameAs: contact.socials.map((social) => social.url),
  };
}

// Also global — describes the site itself, not the person.
export function websiteJsonLd(locale: Locale) {
  const t = dictionaries[locale];

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl(localizedPath("home", locale)),
    inLanguage: locale,
    description: t.meta.home.description,
  };
}

interface CreativeWorkProject {
  slug: string;
  title: string;
  summary: string;
  year: number;
  cover: string;
}

export function projectCreativeWorkJsonLd(
  project: CreativeWorkProject,
  locale: Locale,
) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: absoluteUrl(projectDetailPath(project.slug, locale)),
    image: absoluteUrl(project.cover),
    dateCreated: String(project.year),
    inLanguage: locale,
    author: { "@type": "Person", name: SITE_NAME },
  };
}

interface BreadcrumbProject {
  slug: string;
  title: string;
}

export function projectBreadcrumbJsonLd(
  project: BreadcrumbProject,
  locale: Locale,
) {
  const t = dictionaries[locale];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t.home.heading,
        item: absoluteUrl(localizedPath("home", locale)),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t.projects.heading,
        item: absoluteUrl(localizedPath("projects", locale)),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: absoluteUrl(projectDetailPath(project.slug, locale)),
      },
    ],
  };
}

type MilestoneJsonLdType =
  | "award"
  | "contest"
  | "hackathon"
  | "talk"
  | "press"
  | "publication"
  | "conference";

const MILESTONE_EVENT_TYPES = new Set<MilestoneJsonLdType>([
  "award",
  "contest",
  "hackathon",
  "talk",
  "conference",
]);

interface MilestoneLike {
  slug: string;
  title: string;
  summary: string;
  date: string;
  organization?: string;
  type: MilestoneJsonLdType;
}

function milestoneEventJsonLd(milestone: MilestoneLike, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: milestone.title,
    description: milestone.summary,
    startDate: milestone.date,
    url: absoluteUrl(milestoneDetailPath(milestone.slug, locale)),
    inLanguage: locale,
    ...(milestone.organization
      ? {
          organizer: {
            "@type": "Organization",
            name: milestone.organization,
          },
        }
      : {}),
  };
}

function milestoneCreativeWorkJsonLd(milestone: MilestoneLike, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: milestone.title,
    description: milestone.summary,
    datePublished: milestone.date,
    url: absoluteUrl(milestoneDetailPath(milestone.slug, locale)),
    inLanguage: locale,
    author: { "@type": "Person", name: SITE_NAME },
    ...(milestone.organization
      ? {
          publisher: {
            "@type": "Organization",
            name: milestone.organization,
          },
        }
      : {}),
  };
}

// Schema.org has no single vocabulary entry for "recognition" milestones, so
// the mapping follows what each milestone actually represents: an award,
// contest, hackathon, talk or conference happened at a point in time (an
// Event); a press mention or publication documents something that already
// exists (a CreativeWork), not an event in itself.
export function milestoneJsonLd(milestone: MilestoneLike, locale: Locale) {
  return MILESTONE_EVENT_TYPES.has(milestone.type)
    ? milestoneEventJsonLd(milestone, locale)
    : milestoneCreativeWorkJsonLd(milestone, locale);
}

export function milestoneBreadcrumbJsonLd(
  milestone: MilestoneLike,
  locale: Locale,
) {
  const t = dictionaries[locale];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t.home.heading,
        item: absoluteUrl(localizedPath("home", locale)),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t.career.heading,
        item: absoluteUrl(localizedPath("career", locale)),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: milestone.title,
        item: absoluteUrl(milestoneDetailPath(milestone.slug, locale)),
      },
    ],
  };
}
