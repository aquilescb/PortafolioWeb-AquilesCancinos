import { describe, expect, it, vi } from "vitest";

vi.mock("./data/contact", () => ({
  contact: {
    email: "person@example.com",
    socials: [
      {
        url: "https://github.com/example",
        label: { es: "GitHub", en: "GitHub" },
        kind: "profile",
      },
    ],
  },
}));

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
    {
      slug: "content-pipeline-sample",
      title: { es: "Muestra", en: "Sample" },
      summary: { es: "Resumen", en: "Summary" },
      problem: { es: "Problema", en: "Problem" },
      year: 2025,
      status: "completed",
      tier: "main",
      context: "experimental",
      role: { es: "Dev", en: "Dev" },
      technologies: [{ type: "technology", slug: "typescript" }],
      categories: ["tooling"],
      visibility: "public",
      cover: "/sample.avif",
      screenshots: [],
      caseStudy: { es: true, en: true },
    },
    {
      slug: "content-pipeline-sample-partial",
      title: { es: "Muestra parcial", en: "Partial sample" },
      summary: { es: "Resumen", en: "Summary" },
      problem: { es: "Problema", en: "Problem" },
      year: 2025,
      status: "completed",
      tier: "main",
      context: "experimental",
      role: { es: "Dev", en: "Dev" },
      technologies: [{ type: "technology", slug: "typescript" }],
      categories: ["tooling"],
      visibility: "public",
      cover: "/sample.avif",
      screenshots: [],
      caseStudy: { es: true, en: false },
    },
  ],
}));

vi.mock("./data/experience", () => ({
  experiences: [
    {
      slug: "acme-backend-intern",
      organization: "Acme",
      role: { es: "Pasante", en: "Intern" },
      type: "internship",
      startDate: "2024-01",
      endDate: "2024-06",
      responsibilities: [{ es: "Mantener la API", en: "Maintain the API" }],
      achievements: [],
      technologies: [],
    },
    {
      slug: "ongoing-freelance",
      organization: "Freelance",
      role: { es: "Desarrollador", en: "Developer" },
      type: "freelance",
      startDate: "2025-01",
      responsibilities: [{ es: "Mantener sitios", en: "Maintain sites" }],
      achievements: [],
      technologies: [],
    },
  ],
}));

vi.mock("./data/education", () => ({
  education: [
    {
      slug: "computer-engineering",
      institution: "Universidad",
      degree: { es: "Ingeniería Informática", en: "Computer Engineering" },
      startDate: "2022-03",
      status: "in-progress",
      highlights: [],
      focusAreas: [],
      distinctions: [],
    },
  ],
}));

vi.mock("./data/milestones", () => ({
  milestones: [
    {
      slug: "salta-lab-winner",
      title: { es: "Ganador de Salta Lab", en: "Salta Lab winner" },
      type: "contest",
      date: "2025-11-15",
      summary: { es: "Resumen", en: "Summary" },
      hasOwnPage: true,
      evidence: [
        {
          url: "https://example.com",
          label: { es: "Nota", en: "Note" },
          kind: "press",
        },
      ],
      relatedProjects: [],
    },
  ],
}));

const {
  getFeaturedProjects,
  getAllProjects,
  getProjectBySlug,
  getCaseStudy,
  getAllPrerenderPaths,
  getCareerTimeline,
  getContact,
  hasProjects,
  resolveCaseStudyLocale,
} = await import("./index");

describe("getContact", () => {
  it("splits the email into user and domain instead of joining it", () => {
    const info = getContact("es");

    expect(info.emailUser).toBe("person");
    expect(info.emailDomain).toBe("example.com");
  });

  it("resolves social link labels for the requested locale", () => {
    const info = getContact("es");

    expect(info.socials).toEqual([
      { url: "https://github.com/example", label: "GitHub", kind: "profile" },
    ]);
    expect(info.location).toBeUndefined();
    expect(info.availability).toBeUndefined();
  });
});

describe("hasProjects", () => {
  it("is true once the content layer has at least one project", () => {
    expect(hasProjects()).toBe(true);
  });
});

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
    expect(getAllProjects("en")).toHaveLength(5);
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

  it("flags hasCaseStudy for a project with a declared case study", () => {
    expect(
      getProjectBySlug("content-pipeline-sample", "en")?.hasCaseStudy,
    ).toBe(true);
  });
});

describe("getCareerTimeline", () => {
  it("merges experience, education and milestones, most recent first", () => {
    const timeline = getCareerTimeline("en");

    // "ongoing-freelance" and "computer-engineering" both have no endDate
    // (still in progress), so they tie at the top; between them the stable
    // sort keeps their original relative order (experience before education).
    expect(timeline.map((entry) => entry.slug)).toEqual([
      "ongoing-freelance",
      "computer-engineering",
      "salta-lab-winner", // 2025-11-15
      "acme-backend-intern", // ended 2024-06
    ]);
  });

  it("resolves the requested locale for each entry type", () => {
    const timeline = getCareerTimeline("es");
    const milestone = timeline.find(
      (entry) => entry.slug === "salta-lab-winner",
    );
    const experience = timeline.find(
      (entry) => entry.slug === "acme-backend-intern",
    );
    const education = timeline.find(
      (entry) => entry.slug === "computer-engineering",
    );

    expect(milestone?.title).toBe("Ganador de Salta Lab");
    expect(experience?.title).toBe("Pasante");
    expect(education?.title).toBe("Ingeniería Informática");
  });

  it("filters by entry type", () => {
    const timeline = getCareerTimeline("en", { type: "milestone" });
    expect(timeline.map((entry) => entry.slug)).toEqual(["salta-lab-winner"]);
  });
});

describe("getAllPrerenderPaths", () => {
  it("includes the static routes plus one detail path per project per locale", () => {
    const paths = getAllPrerenderPaths();

    expect(paths).toEqual(
      expect.arrayContaining([
        "/es",
        "/en",
        "/es/proyectos",
        "/en/projects",
        "/es/sobre-mi",
        "/en/about",
        "/es/proyectos/beta",
        "/en/projects/beta",
        "/es/proyectos/gamma",
        "/en/projects/gamma",
      ]),
    );
    // 9 static routes (root + home/projects/career/about x 2 locales) + 5 projects x 2 locales = 19
    expect(paths).toHaveLength(19);
  });
});

describe("resolveCaseStudyLocale", () => {
  it("prefers the requested locale when declared and present", () => {
    expect(
      resolveCaseStudyLocale({ es: true, en: true }, "en", () => true),
    ).toEqual({
      locale: "en",
      isFallback: false,
    });
  });

  it("falls back to the other locale when only it is declared", () => {
    expect(
      resolveCaseStudyLocale({ es: true, en: false }, "en", () => true),
    ).toEqual({
      locale: "es",
      isFallback: true,
    });
  });

  it("returns null when the declared locale's file is missing", () => {
    expect(
      resolveCaseStudyLocale({ es: true, en: false }, "en", () => false),
    ).toBeNull();
  });

  it("returns null when no case study is declared", () => {
    expect(resolveCaseStudyLocale(undefined, "en", () => true)).toBeNull();
  });
});

describe("getCaseStudy", () => {
  it("loads the compiled MDX component for a fully bilingual case study", async () => {
    const result = await getCaseStudy("content-pipeline-sample", "es");
    expect(result?.locale).toBe("es");
    expect(result?.isFallback).toBe(false);
    expect(typeof result?.Component).toBe("function");
  });

  it("falls back to the declared locale and loads its real MDX file", async () => {
    const result = await getCaseStudy("content-pipeline-sample-partial", "en");
    expect(result?.locale).toBe("es");
    expect(result?.isFallback).toBe(true);
    expect(typeof result?.Component).toBe("function");
  });

  it("returns null for a project without a case study", async () => {
    expect(await getCaseStudy("beta", "en")).toBeNull();
  });

  it("returns null for an unknown project", async () => {
    expect(await getCaseStudy("does-not-exist", "en")).toBeNull();
  });
});
