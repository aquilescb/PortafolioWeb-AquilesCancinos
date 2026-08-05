import { Link as RouterLink, useSearchParams } from "react-router";
import type { CareerEntry, CareerEntryType } from "@content";
import type { Locale } from "@content/i18n/locale";
import { localizedPath } from "@content/i18n/route-map";
import { Link } from "~/components/ui/link";
import { useTranslation } from "~/i18n/use-translation";
import {
  collectTimelineTypes,
  parseTimelineFilter,
  toggleTypeFilterParam,
} from "~/lib/timeline-filters";

interface TimelineFiltersProps {
  entries: CareerEntry[];
  locale: Locale;
}

const CHIP_BASE =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs transition-colors duration-200 motion-reduce:transition-none";
const CHIP_INACTIVE =
  "border-ink/15 text-ink/70 hover:border-ink/30 dark:border-ink-dark/20 dark:text-ink-dark/70 dark:hover:border-ink-dark/35";
const CHIP_ACTIVE =
  "border-accent bg-accent text-paper dark:border-accent-dark dark:bg-accent-dark dark:text-paper-dark";

// Same shape as `ProjectFilters`: plain links carrying the toggled query
// string, not buttons with click handlers, so the filtered view is fully
// expressed by the URL and works without client JS.
export function TimelineFilters({ entries, locale }: TimelineFiltersProps) {
  const [searchParams] = useSearchParams();
  const t = useTranslation();
  const filter = parseTimelineFilter(searchParams);
  const types = collectTimelineTypes(entries);
  const basePath = localizedPath("career", locale);

  if (types.length === 0) return null;

  function chipHref(type: CareerEntryType) {
    const next = toggleTypeFilterParam(searchParams, type);
    const query = next.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  function chipClassName(active: boolean) {
    return `${CHIP_BASE} ${active ? CHIP_ACTIVE : CHIP_INACTIVE}`;
  }

  return (
    <div className="mt-8 space-y-4">
      <div>
        <p
          id="filter-type-label"
          className="text-ink/60 dark:text-ink-dark/60 mb-2 text-xs tracking-wide uppercase"
        >
          {t.career.filters.type}
        </p>
        <div
          role="group"
          aria-labelledby="filter-type-label"
          className="flex flex-wrap gap-2"
        >
          {types.map((type) => (
            <RouterLink
              key={type}
              to={chipHref(type)}
              aria-current={filter.type === type ? "true" : undefined}
              className={chipClassName(filter.type === type)}
            >
              {t.career.types[type]}
            </RouterLink>
          ))}
        </div>
      </div>

      {filter.type && (
        <Link to={basePath} className="text-sm">
          {t.career.filters.clear}
        </Link>
      )}
    </div>
  );
}
