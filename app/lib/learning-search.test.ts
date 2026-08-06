import { describe, expect, it } from "vitest";
import type { LearningEntry } from "@content";

import { searchLearningEntries } from "./learning-search";

const entries: LearningEntry[] = [
  {
    kind: "course",
    slug: "advanced-react-patterns",
    name: "Advanced React patterns",
    provider: "Frontend Masters",
    category: "frontend",
    startDate: "2025-01",
    status: "completed",
    relevance: 2,
    featured: true,
    skills: [{ slug: "rest-api-design", name: "REST API design" }],
  },
  {
    kind: "certification",
    slug: "aws-cloud-practitioner",
    name: "AWS Cloud Practitioner",
    provider: "AWS",
    category: "cloud",
    startDate: "2025-03",
    status: "completed",
    relevance: 3,
    featured: true,
    issuedAt: "2025-03-20",
    issuer: "Amazon Web Services",
    skills: [],
  },
];

describe("searchLearningEntries", () => {
  it("returns every entry for an empty query", () => {
    expect(searchLearningEntries(entries, "")).toHaveLength(2);
    expect(searchLearningEntries(entries, "   ")).toHaveLength(2);
  });

  it("matches by name, case-insensitively", () => {
    const result = searchLearningEntries(entries, "react");
    expect(result.map((entry) => entry.slug)).toEqual([
      "advanced-react-patterns",
    ]);
  });

  it("matches by provider", () => {
    const result = searchLearningEntries(entries, "frontend masters");
    expect(result.map((entry) => entry.slug)).toEqual([
      "advanced-react-patterns",
    ]);
  });

  it("matches by category", () => {
    const result = searchLearningEntries(entries, "cloud");
    expect(result.map((entry) => entry.slug)).toEqual([
      "aws-cloud-practitioner",
    ]);
  });

  it("matches by issuer", () => {
    const result = searchLearningEntries(entries, "amazon");
    expect(result.map((entry) => entry.slug)).toEqual([
      "aws-cloud-practitioner",
    ]);
  });

  it("matches by a related skill's name", () => {
    const result = searchLearningEntries(entries, "api design");
    expect(result.map((entry) => entry.slug)).toEqual([
      "advanced-react-patterns",
    ]);
  });

  it("returns an empty array when nothing matches", () => {
    expect(searchLearningEntries(entries, "does-not-exist")).toEqual([]);
  });
});
