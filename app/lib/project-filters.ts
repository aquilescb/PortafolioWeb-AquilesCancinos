import type { ProjectFilter, ProjectSummary } from "@content";

// Mirrors `matchesFilter` in `content/index.ts`, but runs client-side over
// the already-loaded `ProjectSummary[]` instead of the raw `Project[]` +
// `EntityRef[]` shape. Content reads must stay inside loaders (see
// CLAUDE.md), so the list route's loader calls `getAllProjects` unfiltered
// and filtering here narrows what's already in the client bundle — no
// second import of the content layer.
export function matchesProjectFilter(
  project: ProjectSummary,
  filter: ProjectFilter,
): boolean {
  if (
    filter.technology &&
    !project.technologies.some(
      (technology) => technology.slug === filter.technology,
    )
  ) {
    return false;
  }
  if (filter.year !== undefined && project.year !== filter.year) return false;
  if (filter.context && project.context !== filter.context) return false;
  if (filter.category && !project.categories.includes(filter.category))
    return false;
  return true;
}

export function filterProjects(
  projects: ProjectSummary[],
  filter: ProjectFilter,
): ProjectSummary[] {
  return projects.filter((project) => matchesProjectFilter(project, filter));
}

const FILTER_PARAMS = {
  technology: "tech",
  year: "year",
  context: "context",
  category: "category",
} as const satisfies Record<keyof ProjectFilter, string>;

// Reads the current filter straight from the URL, the single source of
// truth for filter state — no component state duplicates it.
export function parseProjectFilter(
  searchParams: URLSearchParams,
): ProjectFilter {
  const yearParam = searchParams.get(FILTER_PARAMS.year);
  const year = yearParam ? Number(yearParam) : undefined;

  return {
    technology: searchParams.get(FILTER_PARAMS.technology) ?? undefined,
    year: year !== undefined && Number.isFinite(year) ? year : undefined,
    context:
      (searchParams.get(FILTER_PARAMS.context) as ProjectFilter["context"]) ??
      undefined,
    category: searchParams.get(FILTER_PARAMS.category) ?? undefined,
  };
}

// Builds the URL for toggling a single filter dimension on or off, keeping
// every other active filter untouched. Toggling an already-active value
// clears that dimension instead of setting it again.
export function toggleFilterParam(
  searchParams: URLSearchParams,
  key: keyof ProjectFilter,
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

type ProjectContext = NonNullable<ProjectFilter["context"]>;

export interface ProjectFilterOptions {
  technologies: { slug: string; name: string }[];
  years: number[];
  contexts: ProjectContext[];
  categories: string[];
}

// Derives the set of filterable values actually present in the (unfiltered)
// project list, so the UI never offers a filter with zero possible matches.
export function collectFilterOptions(
  projects: ProjectSummary[],
): ProjectFilterOptions {
  const technologies = new Map<string, string>();
  const years = new Set<number>();
  const contexts = new Set<ProjectContext>();
  const categories = new Set<string>();

  for (const project of projects) {
    for (const technology of project.technologies) {
      technologies.set(technology.slug, technology.name);
    }
    years.add(project.year);
    contexts.add(project.context);
    for (const category of project.categories) categories.add(category);
  }

  return {
    technologies: [...technologies].map(([slug, name]) => ({ slug, name })),
    years: [...years].sort((a, b) => b - a),
    contexts: [...contexts],
    categories: [...categories].sort(),
  };
}
