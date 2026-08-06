import type { Route } from "./+types/root-redirect";
import { dictionaries } from "@content/i18n/dictionaries";
import { DEFAULT_LOCALE, LOCALES } from "@content/i18n/locale";
import { localizedPath } from "@content/i18n/route-map";
import { absoluteUrl } from "~/seo/site";

const target = localizedPath("home", DEFAULT_LOCALE);

// Prerendered stub for "/". The real redirect happens instantly at the edge
// via `vercel.json`; this page is the fallback for hosts without server-side
// redirects (see ADR 0003) and for crawlers that request "/" directly.
export function meta(_args: Route.MetaArgs) {
  const t = dictionaries[DEFAULT_LOCALE];

  return [
    { title: t.redirect.title },
    { name: "robots", content: "noindex" },
    // Must be absolute — a relative canonical href is invalid per spec (see
    // `~/seo/alternates`'s note on the same rule). The meta refresh target
    // and the in-page fallback link below stay relative on purpose: those
    // are same-site navigations, not the canonical URL declaration.
    { tagName: "link", rel: "canonical", href: absoluteUrl(target) },
    { httpEquiv: "refresh", content: `0; url=${target}` },
  ];
}

export default function RootRedirect() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 text-center">
      {LOCALES.map((locale) => {
        const t = dictionaries[locale];
        return (
          <p key={locale} className="text-ink/70 dark:text-ink-dark/70">
            {t.redirect.message}{" "}
            <a
              href={target}
              className="text-accent dark:text-accent-dark underline"
            >
              {t.redirect.fallbackLink}
            </a>
          </p>
        );
      })}
    </div>
  );
}
