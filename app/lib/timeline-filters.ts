import type { CareerEntry, CareerEntryType, CareerFilter } from "@content";

const TYPE_PARAM = "type";

const CAREER_ENTRY_TYPES: readonly CareerEntryType[] = [
  "experience",
  "education",
  "milestone",
];

function isCareerEntryType(value: string): value is CareerEntryType {
  return (CAREER_ENTRY_TYPES as readonly string[]).includes(value);
}

// Reads the current filter straight from the URL, the single source of
// truth for filter state — no component state duplicates it (mirrors
// `~/lib/project-filters`).
export function parseTimelineFilter(
  searchParams: URLSearchParams,
): CareerFilter {
  const value = searchParams.get(TYPE_PARAM);
  return { type: value && isCareerEntryType(value) ? value : undefined };
}

export function filterTimeline(
  entries: CareerEntry[],
  filter: CareerFilter,
): CareerEntry[] {
  if (!filter.type) return entries;
  return entries.filter((entry) => entry.type === filter.type);
}

// Derives which entry types actually appear in the (unfiltered) timeline, so
// the UI never offers a filter chip with zero possible matches (mirrors
// `collectFilterOptions` in `~/lib/project-filters`). Preserves the fixed
// experience → education → milestone display order rather than data order.
export function collectTimelineTypes(
  entries: CareerEntry[],
): CareerEntryType[] {
  const present = new Set(entries.map((entry) => entry.type));
  return CAREER_ENTRY_TYPES.filter((type) => present.has(type));
}

// Builds the URL for toggling the type filter on or off. Toggling an
// already-active value clears the filter instead of setting it again.
export function toggleTypeFilterParam(
  searchParams: URLSearchParams,
  value: CareerEntryType,
): URLSearchParams {
  const next = new URLSearchParams(searchParams);
  if (next.get(TYPE_PARAM) === value) {
    next.delete(TYPE_PARAM);
  } else {
    next.set(TYPE_PARAM, value);
  }
  return next;
}
