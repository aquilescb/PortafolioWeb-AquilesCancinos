import { describe, expect, it } from "vitest";

import { experienceSchema } from "./experience";

const valid = {
  slug: "acme-backend-intern",
  organization: "Acme",
  role: { es: "Pasante de backend", en: "Backend intern" },
  type: "internship",
  startDate: "2025-01",
  responsibilities: [{ es: "Mantener la API", en: "Maintain the API" }],
} as const;

describe("experienceSchema", () => {
  it("accepts a well-formed ongoing experience", () => {
    const result = experienceSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts an experience with an endDate on or after startDate", () => {
    const result = experienceSchema.safeParse({
      ...valid,
      startDate: "2025-01-01",
      endDate: "2025-06-30",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an endDate before startDate", () => {
    const result = experienceSchema.safeParse({
      ...valid,
      startDate: "2025-06-30",
      endDate: "2025-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an experience with no responsibilities", () => {
    const result = experienceSchema.safeParse({
      ...valid,
      responsibilities: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a responsibility missing a locale", () => {
    const result = experienceSchema.safeParse({
      ...valid,
      responsibilities: [{ es: "Mantener la API" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid experience type", () => {
    const result = experienceSchema.safeParse({ ...valid, type: "founder" });
    expect(result.success).toBe(false);
  });

  it("rejects a malformed startDate", () => {
    const result = experienceSchema.safeParse({
      ...valid,
      startDate: "01/2025",
    });
    expect(result.success).toBe(false);
  });
});
