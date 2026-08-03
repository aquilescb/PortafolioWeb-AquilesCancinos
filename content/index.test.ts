import { describe, expect, it, vi } from "vitest";

vi.mock("./data/technologies", () => ({
  technologies: [
    {
      slug: "typescript",
      name: "TypeScript",
      category: "language",
      level: "working",
    },
  ],
}));

vi.mock("./data/projects", () => ({
  projects: [
    {
      slug: "beta",
      title: { es: "Beta", en: "Beta" },
      summary: { es: "Resumen beta", en: "Beta summary" },
      problem: { es: "Problema", en: "Problem" },
      year: 2023,
      status: "completed",
      tier: "featured",
      context: "professional",
      role: { es: "Dev", en: "Dev" },
      technologies: [{ type: "technology", slug: "typescript" }],
      categories: ["api"],
      visibility: "public",
      cover: "/beta.avif",
      screenshots: [],
      featuredOrder: 1,
    },
    {
      slug: "alpha",
      title: { es: "Alfa", en: "Alpha" },
      summary: { es: "Resumen alfa", en: "Alpha summary" },
      problem: { es: "Problema", en: "Problem" },
      year: 2024,
      status: "completed",
      tier: "featured",
      context: "professional",
      role: { es: "Dev", en: "Dev" },
      technologies: [{ type: "technology", slug: "typescript" }],
      categories: ["web"],
      visibility: "public",
      cover: "/alpha.avif",
      screenshots: [],
      featuredOrder: 2,
    },
    {
      slug: "gamma",
      title: { es: "Gamma", en: "Gamma" },
      summary: { es: "Resumen gamma", en: "Gamma summary" },
      problem: { es: "Problema", en: "Problem" },
      year: 2022,
      status: "archived",
      tier: "complementary",
      context: "academic",
      role: { es: "Dev", en: "Dev" },
      technologies: [{ type: "technology", slug: "typescript" }],
      categories: ["web"],
      visibility: "private",
      cover: "/gamma.avif",
      screenshots: [],
    },
  ],
}));

const { getFeaturedProjects, getAllProjects, getProjectBySlug } =
  await import("./index");

describe("getFeaturedProjects", () => {
  it("returns only featured projects, ordered by featuredOrder", () => {
    const result = getFeaturedProjects("en");
    expect(result.map((project) => project.slug)).toEqual(["beta", "alpha"]);
  });

  it("resolves the requested locale and the project's technologies", () => {
    const [beta] = getFeaturedProjects("es");
    expect(beta?.title).toBe("Beta");
    expect(beta?.technologies).toEqual([
      expect.objectContaining({ slug: "typescript", name: "TypeScript" }),
    ]);
  });
});

describe("getAllProjects", () => {
  it("filters by context", () => {
    const result = getAllProjects("en", { context: "academic" });
    expect(result.map((project) => project.slug)).toEqual(["gamma"]);
  });

  it("filters by technology and category", () => {
    const result = getAllProjects("en", {
      technology: "typescript",
      category: "api",
    });
    expect(result.map((project) => project.slug)).toEqual(["beta"]);
  });

  it("returns every project when no filter is given", () => {
    expect(getAllProjects("en")).toHaveLength(3);
  });
});

describe("getProjectBySlug", () => {
  it("returns null for an unknown slug", () => {
    expect(getProjectBySlug("does-not-exist", "en")).toBeNull();
  });

  it("returns full detail, including private-project fields", () => {
    const gamma = getProjectBySlug("gamma", "en");
    expect(gamma?.visibility).toBe("private");
    expect(gamma?.repositoryUrl).toBeUndefined();
    expect(gamma?.hasCaseStudy).toBe(false);
  });
});
