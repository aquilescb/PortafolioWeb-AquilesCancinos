import { describe, expect, it } from "vitest";

import { projectSchema } from "./project";

const valid = {
  slug: "inventory-system",
  title: { es: "Sistema de inventario", en: "Inventory system" },
  summary: { es: "Resumen", en: "Summary" },
  problem: { es: "Problema", en: "Problem" },
  year: 2025,
  status: "completed",
  tier: "main",
  context: "professional",
  role: { es: "Desarrollador", en: "Developer" },
  technologies: [{ type: "technology", slug: "typescript" }],
  categories: ["web"],
  visibility: "public",
  cover: "/images/inventory-system/cover.avif",
} as const;

describe("projectSchema", () => {
  it("accepts a well-formed public project", () => {
    const result = projectSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects a private project that carries a repositoryUrl", () => {
    const result = projectSchema.safeParse({
      ...valid,
      visibility: "private",
      repositoryUrl: "https://github.com/aquilescb/inventory-system",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a private project without a repositoryUrl", () => {
    const result = projectSchema.safeParse({ ...valid, visibility: "private" });
    expect(result.success).toBe(true);
  });

  it("rejects a non-https repositoryUrl", () => {
    const result = projectSchema.safeParse({
      ...valid,
      repositoryUrl: "http://github.com/aquilescb/inventory-system",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a project with no technologies", () => {
    const result = projectSchema.safeParse({ ...valid, technologies: [] });
    expect(result.success).toBe(false);
  });

  it("rejects a project missing a locale on a localized field", () => {
    const result = projectSchema.safeParse({
      ...valid,
      title: { es: "Sistema de inventario" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects a caseStudy declaration with neither locale set", () => {
    const result = projectSchema.safeParse({
      ...valid,
      caseStudy: { es: false, en: false },
    });
    expect(result.success).toBe(false);
  });

  it("accepts a caseStudy declaration with only one locale set", () => {
    const result = projectSchema.safeParse({
      ...valid,
      caseStudy: { es: true, en: false },
    });
    expect(result.success).toBe(true);
  });
});
