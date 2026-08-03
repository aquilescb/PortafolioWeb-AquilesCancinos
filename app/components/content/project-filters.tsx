import { Link as RouterLink, useSearchParams } from "react-router";
import type { ProjectFilter, ProjectSummary } from "@content";
import type { Locale } from "@content/i18n/locale";
import { localizedPath } from "@content/i18n/route-map";
import { Link } from "~/components/ui/link";
import { useTranslation } from "~/i18n/use-translation";
import {
  collectFilterOptions,
  parseProjectFilter,
  toggleFilterParam,
} from "~/lib/project-filters";

interface ProjectFiltersProps {
  projects: ProjectSummary[];
  locale: Locale;
}

const CHIP_BASE =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs transition-colors duration-200 motion-reduce:transition-none";
const CHIP_INACTIVE =
  "border-ink/15 text-ink/70 hover:border-ink/30 dark:border-ink-dark/20 dark:text-ink-dark/70 dark:hover:border-ink-dark/35";
const CHIP_ACTIVE =
  "border-accent bg-accent text-paper dark:border-accent-dark dark:bg-accent-dark dark:text-paper-dark";

// Filters are plain links carrying the toggled query string, not buttons
// with click handlers: the filtered view is fully expressed by the URL
// (plan §10), so it works without client JS and stays shareable/bookmarkable.
export function ProjectFilters({ projects, locale }: ProjectFiltersProps) {
  const [searchParams] = useSearchParams();
  const t = useTranslation();
  const filter = parseProjectFilter(searchParams);
  const options = collectFilterOptions(projects);
  const basePath = localizedPath("projects", locale);

  const hasOptions =
    options.technologies.length > 0 ||
    options.years.length > 0 ||
    options.contexts.length > 0 ||
    options.categories.length > 0;
  if (!hasOptions) return null;

  const hasActiveFilter = Object.values(filter).some(
    (value) => value !== undefined,
  );

  function chipHref(key: keyof ProjectFilter, value: string) {
    const next = toggleFilterParam(searchParams, key, value);
    const query = next.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  function chipClassName(active: boolean) {
    return `${CHIP_BASE} ${active ? CHIP_ACTIVE : CHIP_INACTIVE}`;
  }

  return (
    <div className="mt-8 space-y-4">
      {options.technologies.length > 0 && (
        <div>
          <p
            id="filter-technology-label"
            className="text-ink/60 dark:text-ink-dark/60 mb-2 text-xs tracking-wide uppercase"
          >
            {t.projects.filters.technology}
          </p>
          <div
            role="group"
            aria-labelledby="filter-technology-label"
            className="flex flex-wrap gap-2"
          >
            {options.technologies.map((technology) => (
              <RouterLink
                key={technology.slug}
                to={chipHref("technology", technology.slug)}
                aria-current={
                  filter.technology === technology.slug ? "true" : undefined
                }
                className={chipClassName(filter.technology === technology.slug)}
              >
                {technology.name}
              </RouterLink>
            ))}
          </div>
        </div>
      )}

      {options.years.length > 0 && (
        <div>
          <p
            id="filter-year-label"
            className="text-ink/60 dark:text-ink-dark/60 mb-2 text-xs tracking-wide uppercase"
          >
            {t.projects.filters.year}
          </p>
          <div
            role="group"
            aria-labelledby="filter-year-label"
            className="flex flex-wrap gap-2"
          >
            {options.years.map((year) => (
              <RouterLink
                key={year}
                to={chipHref("year", String(year))}
                aria-current={filter.year === year ? "true" : undefined}
                className={chipClassName(filter.year === year)}
              >
                {year}
              </RouterLink>
            ))}
          </div>
        </div>
      )}

      {options.contexts.length > 0 && (
        <div>
          <p
            id="filter-context-label"
            className="text-ink/60 dark:text-ink-dark/60 mb-2 text-xs tracking-wide uppercase"
          >
            {t.projects.filters.context}
          </p>
          <div
            role="group"
            aria-labelledby="filter-context-label"
            className="flex flex-wrap gap-2"
          >
            {options.contexts.map((context) => (
              <RouterLink
                key={context}
                to={chipHref("context", context)}
                aria-current={filter.context === context ? "true" : undefined}
                className={chipClassName(filter.context === context)}
              >
                {t.projects.contexts[context]}
              </RouterLink>
            ))}
          </div>
        </div>
      )}

      {options.categories.length > 0 && (
        <div>
          <p
            id="filter-category-label"
            className="text-ink/60 dark:text-ink-dark/60 mb-2 text-xs tracking-wide uppercase"
          >
            {t.projects.filters.category}
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
                aria-current={filter.category === category ? "true" : undefined}
                className={chipClassName(filter.category === category)}
              >
                {category}
              </RouterLink>
            ))}
          </div>
        </div>
      )}

      {hasActiveFilter && (
        <Link to={basePath} className="text-sm">
          {t.projects.filters.clear}
        </Link>
      )}
    </div>
  );
}
