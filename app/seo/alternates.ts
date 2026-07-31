import type { MetaDescriptor } from "react-router";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@content/i18n/locale";
import { localizedPath, type RouteKey } from "@content/i18n/route-map";

// Canonical + hreflang alternates for a route, rendered as `<link>` tags via
// the `meta()` export (a meta descriptor with `tagName: "link"` renders a
// link element — see React Router's meta how-to guide). No separate `links()`
// export is needed, which matters because `links()` receives no arguments
// and can't know which locale it's being rendered for.
export function buildAlternates(
  key: RouteKey,
  locale: Locale,
): MetaDescriptor[] {
  return [
    { tagName: "link", rel: "canonical", href: localizedPath(key, locale) },
    ...LOCALES.map((altLocale) => ({
      tagName: "link" as const,
      rel: "alternate",
      hrefLang: altLocale,
      href: localizedPath(key, altLocale),
    })),
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "x-default",
      href: localizedPath(key, DEFAULT_LOCALE),
    },
  ];
}
