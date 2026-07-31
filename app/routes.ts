import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

import { LOCALES, type Locale } from "../content/i18n/locale";
import { routeMap, type RouteKey } from "../content/i18n/route-map";

// Maps each canonical route key to its component file. One entry per page;
// `localizedRoutes` mounts the same file at both locales' paths.
const routeFiles: Record<RouteKey, string> = {
  home: "routes/home.tsx",
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
