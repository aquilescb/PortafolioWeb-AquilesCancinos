import { describe, expect, it } from "vitest";
import type { LearningEntry } from "@content";

import {
  collectLearningFilterOptions,
  filterLearningEntries,
  getCertifications,
  getComplementaryCourses,
  getFeaturedLearning,
  groupByCategory,
  matchesLearningFilter,
  parseLearningFilter,
  toggleLearningFilterParam,
} from "./learning-filters";

function entry(overrides: Partial<LearningEntry>): LearningEntry {
  return {
    kind: "course",
    slug: "sample-course",
    name: "Sample course",
    provider: "Sample Provider",
    category: "backend",
    startDate: "2025-01",
    status: "completed",
    relevance: 1,
    featured: false,
    skills: [],
    ...overrides,
  };
}

const entries: LearningEntry[] = [
  entry({
    slug: "advanced-react-patterns",
    name: "Advanced React patterns",
    category: "frontend",
    relevance: 2,
    featured: true,
    skills: [{ slug: "rest-api-design", name: "REST API design" }],
  }),
  entry({
    kind: "certification",
    slug: "aws-cloud-practitioner",
    name: "AWS Cloud Practitioner",
    category: "cloud",
    relevance: 3,
    featured: true,
    issuedAt: "2025-03-20",
    issuer: "AWS",
  }),
  entry({
    slug: "backend-basics",
    name: "Backend basics",
    category: "backend",
    relevance: 1,
    featured: false,
  }),
];

describe("getFeaturedLearning", () => {
  it("returns only featured entries, most relevant first", () => {
    const result = getFeaturedLearning(entries);
    expect(result.map((e) => e.slug)).toEqual([
      "aws-cloud-practitioner",
      "advanced-react-patterns",
    ]);
  });
});

describe("getCertifications", () => {
  it("returns only certification-kind entries", () => {
    const result = getCertifications(entries);
    expect(result.map((e) => e.slug)).toEqual(["aws-cloud-practitioner"]);
  });
});

describe("getComplementaryCourses", () => {
  it("returns only course-kind entries", () => {
    const result = getComplementaryCourses(entries);
    expect(result.map((e) => e.slug)).toEqual([
      "advanced-react-patterns",
      "backend-basics",
    ]);
  });
});

describe("groupByCategory", () => {
  it("groups entries by category, sorted alphabetically", () => {
    const result = groupByCategory(getComplementaryCourses(entries));
    expect(result).toEqual([
      { category: "backend", entries: [entries[2]] },
      { category: "frontend", entries: [entries[0]] },
    ]);
  });

  it("returns an empty array for no entries", () => {
    expect(groupByCategory([])).toEqual([]);
  });
});

describe("parseLearningFilter", () => {
  it("reads category, kind and skill from the URL", () => {
    const params = new URLSearchParams(
      "category=backend&kind=course&skill=rest-api-design",
    );
    expect(parseLearningFilter(params)).toEqual({
      category: "backend",
      kind: "course",
      skill: "rest-api-design",
    });
  });

  it("ignores an unknown kind value", () => {
    const params = new URLSearchParams("kind=not-a-real-kind");
    expect(parseLearningFilter(params).kind).toBeUndefined();
  });

  it("returns an empty filter when no params are present", () => {
    expect(parseLearningFilter(new URLSearchParams())).toEqual({
      category: undefined,
      kind: undefined,
      skill: undefined,
    });
  });
});

describe("matchesLearningFilter / filterLearningEntries", () => {
  it("returns every entry when no filter is given", () => {
    expect(filterLearningEntries(entries, {})).toHaveLength(3);
  });

  it("filters by category", () => {
    const result = filterLearningEntries(entries, { category: "backend" });
    expect(result.map((e) => e.slug)).toEqual(["backend-basics"]);
  });

  it("filters by kind", () => {
    const result = filterLearningEntries(entries, { kind: "certification" });
    expect(result.map((e) => e.slug)).toEqual(["aws-cloud-practitioner"]);
  });

  it("filters by skill", () => {
    const result = filterLearningEntries(entries, {
      skill: "rest-api-design",
    });
    expect(result.map((e) => e.slug)).toEqual(["advanced-react-patterns"]);
  });

  it("combines filter dimensions", () => {
    expect(
      matchesLearningFilter(entries[0]!, {
        category: "frontend",
        kind: "certification",
      }),
    ).toBe(false);
  });
});

describe("toggleLearningFilterParam", () => {
  it("sets the param when not already active", () => {
    const next = toggleLearningFilterParam(
      new URLSearchParams(),
      "category",
      "backend",
    );
    expect(next.toString()).toBe("category=backend");
  });

  it("clears the param when toggling the same active value", () => {
    const next = toggleLearningFilterParam(
      new URLSearchParams("category=backend"),
      "category",
      "backend",
    );
    expect(next.toString()).toBe("");
  });

  it("keeps other filter dimensions untouched", () => {
    const next = toggleLearningFilterParam(
      new URLSearchParams("kind=course"),
      "category",
      "backend",
    );
    expect(next.toString()).toBe("kind=course&category=backend");
  });
});

describe("collectLearningFilterOptions", () => {
  it("returns categories, kinds and skills present in the entries", () => {
    const options = collectLearningFilterOptions(entries);
    expect(options.categories).toEqual(["backend", "cloud", "frontend"]);
    expect(options.kinds).toEqual(["course", "certification"]);
    expect(options.skills).toEqual([
      { slug: "rest-api-design", name: "REST API design" },
    ]);
  });

  it("returns empty options for an empty archive", () => {
    expect(collectLearningFilterOptions([])).toEqual({
      categories: [],
      kinds: [],
      skills: [],
    });
  });
});
