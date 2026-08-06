import { useState } from "react";
import { Link as RouterLink, useSearchParams } from "react-router";
import type * as LearningSearchModule from "~/lib/learning-search";
import type { LearningEntry } from "@content";
import type { Locale } from "@content/i18n/locale";
import { localizedPath } from "@content/i18n/route-map";
import { Link } from "~/components/ui/link";
import { useTranslation } from "~/i18n/use-translation";
import {
  collectLearningFilterOptions,
  filterLearningEntries,
  parseLearningFilter,
  toggleLearningFilterParam,
  type LearningFilter,
} from "~/lib/learning-filters";
import { LearningEntryCard } from "./learning-entry-card";

interface LearningArchiveProps {
  entries: LearningEntry[];
  locale: Locale;
}

const CHIP_BASE =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs transition-colors duration-200 motion-reduce:transition-none";
const CHIP_INACTIVE =
  "border-ink/15 text-ink/70 hover:border-ink/30 dark:border-ink-dark/20 dark:text-ink-dark/70 dark:hover:border-ink-dark/35";
const CHIP_ACTIVE =
  "border-accent bg-accent text-paper dark:border-accent-dark dark:bg-accent-dark dark:text-paper-dark";

// The full, filterable archive: URL-synced category/kind/skill filters
// (mirrors `ProjectFilters`/`TimelineFilters`) plus free-text search. The
// search *logic* (`~/lib/learning-search`) is loaded via `import()` only
// once the search field is used, not bundled into this route's initial
// chunk — the plan's budget for a search index that stays cheap even as the
// archive grows into the hundreds of entries (§5).
export function LearningArchive({ entries, locale }: LearningArchiveProps) {
  const [searchParams] = useSearchParams();
  const t = useTranslation();
  const [query, setQuery] = useState("");
  const [searchModule, setSearchModule] = useState<
    typeof LearningSearchModule | null
  >(null);

  const filter = parseLearningFilter(searchParams);
  const options = collectLearningFilterOptions(entries);
  const basePath = localizedPath("learning", locale);

  const filtered = filterLearningEntries(entries, filter);
  const visible =
    query && searchModule
      ? searchModule.searchLearningEntries(filtered, query)
      : filtered;

  function loadSearch() {
    if (!searchModule) {
      void import("~/lib/learning-search").then((module) => {
        setSearchModule(module);
      });
    }
  }

  function chipHref(key: keyof LearningFilter, value: string) {
    const next = toggleLearningFilterParam(searchParams, key, value);
    const queryString = next.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  }

  function chipClassName(active: boolean) {
    return `${CHIP_BASE} ${active ? CHIP_ACTIVE : CHIP_INACTIVE}`;
  }

  const hasActiveFilter = Object.values(filter).some(
    (value) => value !== undefined,
  );
  const hasOptions =
    options.categories.length > 0 ||
    options.kinds.length > 0 ||
    options.skills.length > 0;

  return (
    <div className="mt-6">
      <div>
        <label
          htmlFor="learning-search"
          className="text-ink/60 dark:text-ink-dark/60 mb-2 block text-xs tracking-wide uppercase"
        >
          {t.learning.search.label}
        </label>
        <input
          id="learning-search"
          type="search"
          value={query}
          onFocus={loadSearch}
          onChange={(event) => {
            loadSearch();
            setQuery(event.target.value);
          }}
          placeholder={t.learning.search.placeholder}
          className="border-ink/15 dark:border-ink-dark/20 dark:bg-ink-dark/5 w-full rounded-sm border bg-transparent px-3 py-2 text-sm"
        />
        {query.length > 0 && !searchModule && (
          <p className="text-ink/60 dark:text-ink-dark/60 mt-2 text-sm">
            {t.learning.search.loading}
          </p>
        )}
      </div>

      {hasOptions && (
        <div className="mt-6 space-y-4">
          {options.categories.length > 0 && (
            <div>
              <p
                id="filter-category-label"
                className="text-ink/60 dark:text-ink-dark/60 mb-2 text-xs tracking-wide uppercase"
              >
                {t.learning.filters.category}
              </p>
              <div
                role="group"
                aria-labelledby="filter-category-label"
                className="flex flex-wrap gap-2"
              >
                {options.categories.map((category) => (
                  <RouterLink
                    key={category}
                    to={chipHref("category", category)}
                    aria-current={
                      filter.category === category ? "true" : undefined
                    }
                    className={chipClassName(filter.category === category)}
                  >
                    {category}
                  </RouterLink>
                ))}
              </div>
            </div>
          )}

          {options.kinds.length > 0 && (
            <div>
              <p
                id="filter-kind-label"
                className="text-ink/60 dark:text-ink-dark/60 mb-2 text-xs tracking-wide uppercase"
              >
                {t.learning.filters.kind}
              </p>
              <div
                role="group"
                aria-labelledby="filter-kind-label"
                className="flex flex-wrap gap-2"
              >
                {options.kinds.map((kind) => (
                  <RouterLink
                    key={kind}
                    to={chipHref("kind", kind)}
                    aria-current={filter.kind === kind ? "true" : undefined}
                    className={chipClassName(filter.kind === kind)}
                  >
                    {t.learning.kinds[kind]}
                  </RouterLink>
                ))}
              </div>
            </div>
          )}

          {options.skills.length > 0 && (
            <div>
              <p
                id="filter-skill-label"
                className="text-ink/60 dark:text-ink-dark/60 mb-2 text-xs tracking-wide uppercase"
              >
                {t.learning.filters.skill}
              </p>
              <div
                role="group"
                aria-labelledby="filter-skill-label"
                className="flex flex-wrap gap-2"
              >
                {options.skills.map((skill) => (
                  <RouterLink
                    key={skill.slug}
                    to={chipHref("skill", skill.slug)}
                    aria-current={
                      filter.skill === skill.slug ? "true" : undefined
                    }
                    className={chipClassName(filter.skill === skill.slug)}
                  >
                    {skill.name}
                  </RouterLink>
                ))}
              </div>
            </div>
          )}

          {hasActiveFilter && (
            <Link to={basePath} className="text-sm">
              {t.learning.filters.clear}
            </Link>
          )}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="text-ink/60 dark:text-ink-dark/60 mt-8">
          {t.learning.empty.archive}
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {visible.map((entry) => (
            <LearningEntryCard
              key={`${entry.kind}-${entry.slug}`}
              entry={entry}
            />
          ))}
        </div>
      )}
    </div>
  );
}
