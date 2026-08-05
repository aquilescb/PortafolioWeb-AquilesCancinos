import { describe, expect, it } from "vitest";
import type { CareerEntry } from "@content";

import {
  collectTimelineTypes,
  filterTimeline,
  parseTimelineFilter,
  toggleTypeFilterParam,
} from "./timeline-filters";

const entries: CareerEntry[] = [
  {
    type: "experience",
    slug: "acme-backend-intern",
    title: "Backend intern",
    startDate: "2024-01",
    endDate: "2024-06",
  },
  {
    type: "milestone",
    slug: "salta-lab-winner",
    title: "Salta Lab winner",
    startDate: "2025-11-15",
  },
];

describe("parseTimelineFilter", () => {
  it("reads a known type from the URL", () => {
    const params = new URLSearchParams("type=milestone");
    expect(parseTimelineFilter(params)).toEqual({ type: "milestone" });
  });

  it("ignores an unknown type value", () => {
    const params = new URLSearchParams("type=not-a-real-type");
    expect(parseTimelineFilter(params)).toEqual({ type: undefined });
  });

  it("returns an empty filter when no type param is present", () => {
    expect(parseTimelineFilter(new URLSearchParams())).toEqual({
      type: undefined,
    });
  });
});

describe("filterTimeline", () => {
  it("returns every entry when no filter is given", () => {
    expect(filterTimeline(entries, {})).toHaveLength(2);
  });

  it("filters by type", () => {
    const result = filterTimeline(entries, { type: "experience" });
    expect(result.map((entry) => entry.slug)).toEqual(["acme-backend-intern"]);
  });
});

describe("collectTimelineTypes", () => {
  it("returns only types present in the entries, in a fixed display order", () => {
    expect(collectTimelineTypes(entries)).toEqual(["experience", "milestone"]);
  });

  it("returns an empty array for an empty timeline", () => {
    expect(collectTimelineTypes([])).toEqual([]);
  });
});

describe("toggleTypeFilterParam", () => {
  it("sets the type param when not already active", () => {
    const next = toggleTypeFilterParam(new URLSearchParams(), "milestone");
    expect(next.toString()).toBe("type=milestone");
  });

  it("clears the type param when toggling the same active value", () => {
    const next = toggleTypeFilterParam(
      new URLSearchParams("type=milestone"),
      "milestone",
    );
    expect(next.toString()).toBe("");
  });
});
