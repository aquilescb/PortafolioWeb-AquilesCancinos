import { describe, expect, it } from "vitest";
import type { ProjectSummary } from "@content";

import {
  collectFilterOptions,
  filterProjects,
  parseProjectFilter,
  toggleFilterParam,
} from "./project-filters";

function project(overrides: Partial<ProjectSummary> = {}): ProjectSummary {
  return {
    slug: "inventory-system",
    title: "Inventory System",
    summary: "A system that tracks inventory.",
    year: 2025,
    tier: "featured",
    context: "professional",
    categories: ["web"],
    visibility: "public",
    cover: "/images/inventory-system/cover.jpg",
    technologies: [
      { slug: "react", name: "React", category: "framework", level: "core" },
    ],
    ...overrides,
  };
}

describe("filterProjects", () => {
  const projects = [
    project({ slug: "a", year: 2025, context: "professional" }),
    project({
      slug: "b",
      year: 2024,
      context: "personal",
      technologies: [
        { slug: "vue", name: "Vue", category: "framework", level: "working" },
      ],
      categories: ["mobile"],
    }),
  ];

  it("returns every project when the filter is empty", () => {
    expect(filterProjects(projects, {})).toHaveLength(2);
  });

  it("filters by technology slug", () => {
    expect(filterProjects(projects, { technology: "vue" })).toEqual([
      projects[1],
    ]);
  });

  it("filters by year", () => {
    expect(filterProjects(projects, { year: 2025 })).toEqual([projects[0]]);
  });

  it("filters by context", () => {
    expect(filterProjects(projects, { context: "personal" })).toEqual([
      projects[1],
    ]);
  });

  it("filters by category", () => {
    expect(filterProjects(projects, { category: "mobile" })).toEqual([
      projects[1],
    ]);
  });

  it("combines filters with AND semantics", () => {
    expect(
      filterProjects(projects, { year: 2025, context: "personal" }),
    ).toEqual([]);
  });
});

describe("parseProjectFilter", () => {
  it("reads every dimension from the query string", () => {
    const params = new URLSearchParams(
      "tech=react&year=2025&context=professional&category=web",
    );

    expect(parseProjectFilter(params)).toEqual({
      technology: "react",
      year: 2025,
      context: "professional",
      category: "web",
    });
  });

  it("leaves a dimension undefined when its param is missing", () => {
    expect(parseProjectFilter(new URLSearchParams())).toEqual({
      technology: undefined,
      year: undefined,
      context: undefined,
      category: undefined,
    });
  });

  it("ignores a non-numeric year", () => {
    expect(
      parseProjectFilter(new URLSearchParams("year=not-a-number")).year,
    ).toBeUndefined();
  });
});

describe("toggleFilterParam", () => {
  it("sets a param that isn't active yet", () => {
    const next = toggleFilterParam(
      new URLSearchParams(),
      "technology",
      "react",
    );
    expect(next.get("tech")).toBe("react");
  });

  it("clears a param that's already set to the same value", () => {
    const next = toggleFilterParam(
      new URLSearchParams("tech=react"),
      "technology",
      "react",
    );
    expect(next.has("tech")).toBe(false);
  });

  it("replaces a param set to a different value", () => {
    const next = toggleFilterParam(
      new URLSearchParams("tech=react"),
      "technology",
      "vue",
    );
    expect(next.get("tech")).toBe("vue");
  });

  it("leaves other dimensions untouched", () => {
    const next = toggleFilterParam(
      new URLSearchParams("tech=react&year=2025"),
      "technology",
      "vue",
    );
    expect(next.get("year")).toBe("2025");
  });
});

describe("collectFilterOptions", () => {
  it("derives distinct, sorted option sets from the project list", () => {
    const projects = [
      project({
        slug: "a",
        year: 2025,
        categories: ["web", "api"],
        technologies: [
          {
            slug: "react",
            name: "React",
            category: "framework",
            level: "core",
          },
        ],
      }),
      project({
        slug: "b",
        year: 2023,
        context: "personal",
        categories: ["mobile"],
        technologies: [
          { slug: "vue", name: "Vue", category: "framework", level: "working" },
        ],
      }),
    ];

    expect(collectFilterOptions(projects)).toEqual({
      technologies: [
        { slug: "react", name: "React" },
        { slug: "vue", name: "Vue" },
      ],
      years: [2025, 2023],
      contexts: ["professional", "personal"],
      categories: ["api", "mobile", "web"],
    });
  });

  it("returns empty option sets for an empty project list", () => {
    expect(collectFilterOptions([])).toEqual({
      technologies: [],
      years: [],
      contexts: [],
      categories: [],
    });
  });
});
