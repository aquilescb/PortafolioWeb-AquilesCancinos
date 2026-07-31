import type { MetaDescriptor } from "react-router";
import type { Locale } from "@content/i18n/locale";

interface BuildMetaOptions {
  locale: Locale;
  title: string;
  description: string;
}

const OG_LOCALES: Record<Locale, string> = { es: "es_ES", en: "en_US" };

// Title, description and Open Graph / Twitter tags shared by every route.
// Canonical and hreflang links live in `alternates.ts` since they depend on
// the route's key, not just its copy.
export function buildMeta({
  locale,
  title,
  description,
}: BuildMetaOptions): MetaDescriptor[] {
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: OG_LOCALES[locale] },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}
