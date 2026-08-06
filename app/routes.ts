import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

import { hasMilestonePages, hasProjects } from "../content";
import { LOCALES, type Locale } from "../content/i18n/locale";
import {
  milestoneSegment,
  routeMap,
  type RouteKey,
} from "../content/i18n/route-map";

// Maps each canonical route key to its component file. One entry per page;
// `localizedRoutes` mounts the same file at both locales' paths.
const routeFiles: Record<RouteKey, string> = {
  home: "routes/home.tsx",
  projects: "routes/projects.tsx",
  career: "routes/career.tsx",
  learning: "routes/learning.tsx",
  about: "routes/about.tsx",
};

const routeKeys = Object.keys(routeMap) as RouteKey[];

function localizedRoutes(locale: Locale) {
  return prefix(locale, [
    ...routeKeys.map((key) => {
      const segment = routeMap[key][locale];
      const file = routeFiles[key];
      return segment
        ? route(segment, file, { id: `${key}-${locale}` })
        : index(file, { id: `${key}-${locale}` });
    }),
    // Project detail takes a dynamic `slug`, so it isn't in `routeMap`
    // (which only covers fixed per-locale paths) — mounted directly under
    // the same localized `projects` segment instead. Only registered once a
    // real project exists: with `ssr:false`, a route with a `loader` must be
    // matched by at least one prerender path, which is impossible while
    // `content/data/projects.ts` is empty (see `hasProjects` in content/index.ts).
    ...(hasProjects()
      ? [
          route(
            `${routeMap.projects[locale]}/:slug`,
            "routes/project-detail.tsx",
            { id: `project-detail-${locale}` },
          ),
        ]
      : []),
    // Milestone detail lives under its own top-level segment, not nested
    // under `career` (plan §7) — same conditional-registration reasoning as
    // project detail: only mounted once at least one milestone declares
    // `hasOwnPage: true` (see `hasMilestonePages` in content/index.ts).
    ...(hasMilestonePages()
      ? [
          route(
            `${milestoneSegment[locale]}/:slug`,
            "routes/milestone-detail.tsx",
            { id: `milestone-detail-${locale}` },
          ),
        ]
      : []),
    route("*", "routes/not-found.tsx", { id: `not-found-${locale}` }),
  ]);
}

export default [
  index("routes/root-redirect.tsx"),
  ...LOCALES.flatMap(localizedRoutes),
  // Any path outside `/es/*` and `/en/*` (an unprefixed or malformed URL)
  // still gets a localized not-found page instead of the generic crash
  // screen, defaulting to the site's default locale.
  route("*", "routes/not-found.tsx", { id: "not-found-root" }),
] satisfies RouteConfig;
