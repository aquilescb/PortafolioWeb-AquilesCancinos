import { isLocale, LOCALES, type Locale } from "./locale";

// Canonical route keys mapped to their localized path segment. One entry per
// page; both locales share a single component in `app/routes/**`. New
// sections (projects, career, learning, about) are added here as later
// phases introduce their route files — nothing else needs to change.
export const routeMap = {
  home: { es: "", en: "" },
  projects: { es: "proyectos", en: "projects" },
  career: { es: "trayectoria", en: "career" },
  about: { es: "sobre-mi", en: "about" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routeMap;

const routeKeys = Object.keys(routeMap) as RouteKey[];

export function localizedPath(key: RouteKey, locale: Locale): string {
  const segment = routeMap[key][locale];
  return segment ? `/${locale}/${segment}` : `/${locale}`;
}

// Project detail lives under the `projects` segment but isn't in `routeMap`
// itself: it takes a dynamic `slug`, not a fixed per-locale path.
export function projectDetailPath(slug: string, locale: Locale): string {
  return `${localizedPath("projects", locale)}/${slug}`;
}

// Milestone detail is *not* nested under `career`/`trayectoria` (plan §7):
// it's its own top-level segment, with no entry in `routeMap` since — like
// project detail — it takes a dynamic `slug` rather than a fixed path.
export const milestoneSegment: Record<Locale, string> = {
  es: "hitos",
  en: "milestones",
};

export function milestoneDetailPath(slug: string, locale: Locale): string {
  return `/${locale}/${milestoneSegment[locale]}/${slug}`;
}

// Every static path the site needs prerendered: the root redirect stub plus
// every route key in every locale. Dynamic paths (entity slugs) are added in
// Phase 3 once the content layer can enumerate them.
export function getStaticPaths(): string[] {
  return [
    "/",
    ...LOCALES.flatMap((locale) =>
      routeKeys.map((key) => localizedPath(key, locale)),
    ),
  ];
}

function routeKeyForSegment(
  locale: Locale,
  segment: string,
): RouteKey | undefined {
  return routeKeys.find((key) => routeMap[key][locale] === segment);
}

// Resolves the equivalent URL of the current page in another locale, so the
// language switcher lands on the same page rather than always going home.
// Falls back to the target locale's home page when the current path doesn't
// match a known route (e.g. a broken URL on the not-found page).
export function equivalentPath(pathname: string, targetLocale: Locale): string {
  const [, currentSegment, ...rest] = pathname.split("/");
  const key =
    currentSegment && isLocale(currentSegment)
      ? routeKeyForSegment(currentSegment, rest.join("/"))
      : undefined;
  return localizedPath(key ?? "home", targetLocale);
}
