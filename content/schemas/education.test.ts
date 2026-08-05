import { describe, expect, it } from "vitest";

import { educationSchema } from "./education";

const valid = {
  slug: "computer-engineering",
  institution: "Universidad",
  degree: { es: "Ingeniería Informática", en: "Computer Engineering" },
  startDate: "2022-03",
  status: "in-progress",
} as const;

describe("educationSchema", () => {
  it("accepts a well-formed in-progress education entry", () => {
    const result = educationSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts a completed entry with an endDate", () => {
    const result = educationSchema.safeParse({
      ...valid,
      status: "completed",
      endDate: "2026-12",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a degree missing a locale", () => {
    const result = educationSchema.safeParse({
      ...valid,
      degree: { es: "Ingeniería Informática" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid status", () => {
    const result = educationSchema.safeParse({ ...valid, status: "dropped" });
    expect(result.success).toBe(false);
  });

  it("rejects a malformed startDate", () => {
    const result = educationSchema.safeParse({
      ...valid,
      startDate: "March 2022",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a negative gpa", () => {
    const result = educationSchema.safeParse({ ...valid, gpa: -1 });
    expect(result.success).toBe(false);
  });
});
