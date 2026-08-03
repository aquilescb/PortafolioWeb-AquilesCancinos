import { describe, expect, it } from "vitest";

import { technologySchema } from "./technology";

const valid = {
  slug: "typescript",
  name: "TypeScript",
  category: "language",
  level: "working",
} as const;

describe("technologySchema", () => {
  it("accepts a well-formed technology", () => {
    expect(technologySchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an unknown category", () => {
    expect(
      technologySchema.safeParse({ ...valid, category: "runtime" }).success,
    ).toBe(false);
  });

  it("rejects an unknown level", () => {
    expect(
      technologySchema.safeParse({ ...valid, level: "expert" }).success,
    ).toBe(false);
  });

  it("never accepts a numeric level (no skill percentages)", () => {
    expect(technologySchema.safeParse({ ...valid, level: 80 }).success).toBe(
      false,
    );
  });
});
