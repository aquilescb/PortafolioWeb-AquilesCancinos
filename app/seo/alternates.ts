import type { MetaDescriptor } from "react-router";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@content/i18n/locale";
import { localizedPath, type RouteKey } from "@content/i18n/route-map";
import { absoluteUrl } from "./site";

// Canonical + hreflang alternates for a route, rendered as `<link>` tags via
// the `meta()` export (a meta descriptor with `tagName: "link"` renders a
// link element — see React Router's meta how-to guide). No separate `links()`
// export is needed, which matters because `links()` receives no arguments
// and can't know which locale it's being rendered for.
//
// Takes a `pathForLocale` function rather than a fixed `RouteKey` so entity
// pages (project detail) can build alternates for their slugged path, not
// just the small set of static routes in `routeMap`.
// `canonical` and `hreflang` links must be absolute URLs per spec — a
// root-relative href (e.g. `/es`) is invalid and gets flagged by SEO
// auditors (Lighthouse's `canonical`/`hreflang` audits both score 0 on a
// relative href), so every path from `pathForLocale` is wrapped in
// `absoluteUrl` before it's used as an `href`.
export function buildAlternates(
  locale: Locale,
  pathForLocale: (locale: Locale) => string,
): MetaDescriptor[] {
  return [
    {
      tagName: "link",
      rel: "canonical",
      href: absoluteUrl(pathForLocale(locale)),
    },
    ...LOCALES.map((altLocale) => ({
      tagName: "link" as const,
      rel: "alternate",
      hrefLang: altLocale,
      href: absoluteUrl(pathForLocale(altLocale)),
    })),
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "x-default",
      href: absoluteUrl(pathForLocale(DEFAULT_LOCALE)),
    },
  ];
}

// Convenience wrapper for the common case: a static route from `routeMap`.
export function buildRouteAlternates(
  key: RouteKey,
  locale: Locale,
): MetaDescriptor[] {
  return buildAlternates(locale, (altLocale) => localizedPath(key, altLocale));
}
