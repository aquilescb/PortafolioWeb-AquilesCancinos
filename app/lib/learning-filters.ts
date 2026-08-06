import type { LearningEntry, LearningEntryKind, LearningSkill } from "@content";

// Featured entries first by curated `relevance` (3 highest), then by recency
// — the loader's global sort by date alone isn't enough to rank a highly
// relevant but older certification above a merely-present recent course.
export function getFeaturedLearning(entries: LearningEntry[]): LearningEntry[] {
  return entries
    .filter((entry) => entry.featured)
    .sort((a, b) => b.relevance - a.relevance);
}

export function getCertifications(entries: LearningEntry[]): LearningEntry[] {
  return entries.filter((entry) => entry.kind === "certification");
}

export function getComplementaryCourses(
  entries: LearningEntry[],
): LearningEntry[] {
  return entries.filter((entry) => entry.kind === "course");
}

export interface LearningCategoryGroup {
  category: string;
  entries: LearningEntry[];
}

// Groups (and sorts) a course list by `category` for the collapsed
// "complementary formation" section — alphabetical, since there's no
// inherent order across categories the way there is across dates.
export function groupByCategory(
  entries: LearningEntry[],
): LearningCategoryGroup[] {
  const byCategory = new Map<string, LearningEntry[]>();
  for (const entry of entries) {
    const group = byCategory.get(entry.category) ?? [];
    group.push(entry);
    byCategory.set(entry.category, group);
  }
  return [...byCategory.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, categoryEntries]) => ({
      category,
      entries: categoryEntries,
    }));
}

export interface LearningFilter {
  category?: string;
  kind?: LearningEntryKind;
  skill?: string;
}

const FILTER_PARAMS = {
  category: "category",
  kind: "kind",
  skill: "skill",
} as const satisfies Record<keyof LearningFilter, string>;

const LEARNING_ENTRY_KINDS: readonly LearningEntryKind[] = [
  "course",
  "certification",
];

function isLearningEntryKind(value: string): value is LearningEntryKind {
  return (LEARNING_ENTRY_KINDS as readonly string[]).includes(value);
}

// Reads the current filter straight from the URL, the single source of
// truth for filter state — no component state duplicates it (mirrors
// `~/lib/project-filters`).
export function parseLearningFilter(
  searchParams: URLSearchParams,
): LearningFilter {
  const kindValue = searchParams.get(FILTER_PARAMS.kind);

  return {
    category: searchParams.get(FILTER_PARAMS.category) ?? undefined,
    kind: kindValue && isLearningEntryKind(kindValue) ? kindValue : undefined,
    skill: searchParams.get(FILTER_PARAMS.skill) ?? undefined,
  };
}

export function matchesLearningFilter(
  entry: LearningEntry,
  filter: LearningFilter,
): boolean {
  if (filter.category && entry.category !== filter.category) return false;
  if (filter.kind && entry.kind !== filter.kind) return false;
  if (
    filter.skill &&
    !entry.skills.some((skill) => skill.slug === filter.skill)
  ) {
    return false;
  }
  return true;
}

export function filterLearningEntries(
  entries: LearningEntry[],
  filter: LearningFilter,
): LearningEntry[] {
  return entries.filter((entry) => matchesLearningFilter(entry, filter));
}

// Builds the URL for toggling a single filter dimension on or off, keeping
// every other active filter untouched. Toggling an already-active value
// clears that dimension instead of setting it again (mirrors
// `~/lib/project-filters`).
export function toggleLearningFilterParam(
  searchParams: URLSearchParams,
  key: keyof LearningFilter,
  value: string,
): URLSearchParams {
  const next = new URLSearchParams(searchParams);
  const param = FILTER_PARAMS[key];
  if (next.get(param) === value) {
    next.delete(param);
  } else {
    next.set(param, value);
  }
  return next;
}

export interface LearningFilterOptions {
  categories: string[];
  kinds: LearningEntryKind[];
  skills: LearningSkill[];
}

// Derives the set of filterable values actually present in the (unfiltered)
// archive, so the UI never offers a filter with zero possible matches
// (mirrors `collectFilterOptions` in `~/lib/project-filters`).
export function collectLearningFilterOptions(
  entries: LearningEntry[],
): LearningFilterOptions {
  const categories = new Set<string>();
  const kinds = new Set<LearningEntryKind>();
  const skills = new Map<string, string>();

  for (const entry of entries) {
    categories.add(entry.category);
    kinds.add(entry.kind);
    for (const skill of entry.skills) skills.set(skill.slug, skill.name);
  }

  return {
    categories: [...categories].sort(),
    kinds: LEARNING_ENTRY_KINDS.filter((kind) => kinds.has(kind)),
    skills: [...skills].map(([slug, name]) => ({ slug, name })),
  };
}
