import { describe, expect, it } from "vitest";

import { milestoneSchema } from "./milestone";

const evidence = [
  {
    url: "https://example.com/press",
    label: { es: "Nota de prensa", en: "Press coverage" },
    kind: "press",
  },
] as const;

const valid = {
  slug: "salta-lab-winner",
  title: { es: "Ganador de Salta Lab", en: "Salta Lab winner" },
  type: "contest",
  date: "2025-11-15",
  summary: { es: "Resumen", en: "Summary" },
  hasOwnPage: false,
  evidence,
} as const;

describe("milestoneSchema", () => {
  it("accepts a well-formed milestone without its own page", () => {
    const result = milestoneSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts hasOwnPage true when a body is declared", () => {
    const result = milestoneSchema.safeParse({
      ...valid,
      hasOwnPage: true,
      body: { es: true, en: false },
    });
    expect(result.success).toBe(true);
  });

  it("rejects hasOwnPage true with no body declared", () => {
    const result = milestoneSchema.safeParse({ ...valid, hasOwnPage: true });
    expect(result.success).toBe(false);
  });

  it("rejects a body declaration with neither locale set", () => {
    const result = milestoneSchema.safeParse({
      ...valid,
      hasOwnPage: true,
      body: { es: false, en: false },
    });
    expect(result.success).toBe(false);
  });

  it("rejects a milestone with no evidence", () => {
    const result = milestoneSchema.safeParse({ ...valid, evidence: [] });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid milestone type", () => {
    const result = milestoneSchema.safeParse({ ...valid, type: "medal" });
    expect(result.success).toBe(false);
  });

  it("rejects a malformed date", () => {
    const result = milestoneSchema.safeParse({ ...valid, date: "15-11-2025" });
    expect(result.success).toBe(false);
  });

  it("accepts a relatedProjects entry pointing at a project", () => {
    const result = milestoneSchema.safeParse({
      ...valid,
      relatedProjects: [{ type: "project", slug: "inventory-system" }],
    });
    expect(result.success).toBe(true);
  });
});
