import type { Route } from "./+types/learning";
import { getLearningEntries } from "@content";
import { dictionaries } from "@content/i18n/dictionaries";
import { localeFromPathname } from "@content/i18n/locale";
import { LearningArchive } from "~/components/content/learning-archive";
import { LearningEntryCard } from "~/components/content/learning-entry-card";
import { buildRouteAlternates } from "~/seo/alternates";
import { globalMetaTags } from "~/seo/json-ld";
import { buildMeta } from "~/seo/meta";
import { useLocale } from "~/i18n/use-locale";
import { useTranslation } from "~/i18n/use-translation";
import {
  getCertifications,
  getComplementaryCourses,
  getFeaturedLearning,
  groupByCategory,
} from "~/lib/learning-filters";

export function meta({ location, matches }: Route.MetaArgs) {
  const locale = localeFromPathname(location.pathname);
  const t = dictionaries[locale];

  return [
    ...globalMetaTags(matches),
    ...buildMeta({
      locale,
      title: t.meta.learning.title,
      description: t.meta.learning.description,
    }),
    ...buildRouteAlternates("learning", locale),
  ];
}

export function loader({ request }: Route.LoaderArgs) {
  const locale = localeFromPathname(new URL(request.url).pathname);
  return { entries: getLearningEntries(locale) };
}

// The archive's URL filters and search are applied client-side over the
// entries the loader already returned (see `~/lib/learning-filters` and
// `~/components/content/learning-archive`), so a filter or search change
// must not trigger a pointless loader refetch (mirrors `career.tsx`).
export function shouldRevalidate() {
  return false;
}

export default function Learning({ loaderData }: Route.ComponentProps) {
  const locale = useLocale();
  const t = useTranslation();
  const { entries } = loaderData;

  const featured = getFeaturedLearning(entries);
  const certifications = getCertifications(entries);
  const complementaryGroups = groupByCategory(getComplementaryCourses(entries));

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-medium tracking-tight">
        {t.learning.heading}
      </h1>
      <p className="text-ink/70 dark:text-ink-dark/70 mt-3">
        {t.learning.intro}
      </p>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-medium tracking-tight">
          {t.learning.sections.featured}
        </h2>
        {featured.length === 0 ? (
          <p className="text-ink/60 dark:text-ink-dark/60 mt-4">
            {t.learning.empty.featured}
          </p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {featured.map((entry) => (
              <LearningEntryCard
                key={`${entry.kind}-${entry.slug}`}
                entry={entry}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-medium tracking-tight">
          {t.learning.sections.certifications}
        </h2>
        {certifications.length === 0 ? (
          <p className="text-ink/60 dark:text-ink-dark/60 mt-4">
            {t.learning.empty.certifications}
          </p>
        ) : (
          <ul className="border-ink/10 dark:border-ink-dark/15 mt-6 divide-y divide-inherit border-y">
            {certifications.map((entry) => (
              <li
                key={entry.slug}
                className="flex items-center justify-between gap-4 py-3 text-sm"
              >
                <span>
                  {entry.name}
                  <span className="text-ink/60 dark:text-ink-dark/60">
                    {" "}
                    · {entry.issuer}
                  </span>
                </span>
                <span className="text-ink/60 dark:text-ink-dark/60">
                  {entry.issuedAt}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-medium tracking-tight">
          {t.learning.sections.complementary}
        </h2>
        {complementaryGroups.length === 0 ? (
          <p className="text-ink/60 dark:text-ink-dark/60 mt-4">
            {t.learning.empty.complementary}
          </p>
        ) : (
          <div className="mt-6 space-y-2">
            {complementaryGroups.map((group) => (
              <details
                key={group.category}
                className="border-ink/10 dark:border-ink-dark/15 border-b py-3"
              >
                <summary className="cursor-pointer text-sm font-medium">
                  {group.category} ({group.entries.length})
                </summary>
                <ul className="mt-3 space-y-1 text-sm">
                  {group.entries.map((entry) => (
                    <li key={entry.slug}>
                      {entry.name} — {entry.provider}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        )}
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-medium tracking-tight">
          {t.learning.sections.archive}
        </h2>
        <LearningArchive entries={entries} locale={locale} />
      </section>
    </div>
  );
}
