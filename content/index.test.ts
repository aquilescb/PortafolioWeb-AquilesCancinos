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
      relatedProjects: [{ type: "project", slug: "beta" }],
      videoId: "dQw4w9WgXcQ",
    },
    {
      slug: "no-own-page",
      title: { es: "Sin página", en: "No own page" },
      type: "press",
      date: "2025-01-01",
      summary: { es: "Resumen", en: "Summary" },
      hasOwnPage: false,
      evidence: [
        {
          url: "https://example.com/press",
          label: { es: "Prensa", en: "Press" },
          kind: "press",
        },
      ],
      relatedProjects: [],
    },
    {
      slug: "sample-milestone",
      title: { es: "Muestra", en: "Sample" },
      type: "publication",
      date: "2020-01-01",
      summary: { es: "Resumen", en: "Summary" },
      hasOwnPage: false,
      evidence: [
        {
          url: "https://example.com/sample",
          label: { es: "Muestra", en: "Sample" },
          kind: "press",
        },
      ],
      relatedProjects: [],
      body: { es: true, en: true },
    },
  ],
}));

vi.mock("./data/skills", () => ({
  skills: [
    {
      slug: "rest-api-design",
      name: { es: "Diseño de APIs REST", en: "REST API design" },
      category: "backend",
      evidence: [{ type: "project", slug: "beta" }],
    },
  ],
}));

vi.mock("./data/courses", () => ({
  courses: [
    {
      slug: "advanced-react-patterns",
      name: {
        es: "Patrones avanzados de React",
        en: "Advanced React patterns",
      },
      provider: "Frontend Masters",
      startDate: "2025-01",
      endDate: "2025-02",
      status: "completed",
      category: "frontend",
      skills: [{ type: "skill", slug: "rest-api-design" }],
      relevance: 2,
      featured: false,
    },
    {
      slug: "ongoing-course",
      name: { es: "Curso en curso", en: "Ongoing course" },
      provider: "Coursera",
      startDate: "2026-01",
      status: "in-progress",
      category: "backend",
      skills: [],
      relevance: 1,
      featured: false,
    },
  ],
}));

vi.mock("./data/certifications", () => ({
  certifications: [
    {
      slug: "aws-cloud-practitioner",
      name: { es: "AWS Cloud Practitioner", en: "AWS Cloud Practitioner" },
      provider: "AWS",
      startDate: "2025-03",
      status: "completed",
      category: "cloud",
      skills: [],
      relevance: 3,
      featured: true,
      verificationUrl: "https://example.com/verify",
      issuedAt: "2025-03-20",
      issuer: "Amazon Web Services",
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
  getLearningEntries,
  getMilestoneBody,
  getMilestoneBySlug,
  hasMilestonePages,
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
      "no-own-page", // 2025-01-01
      "acme-backend-intern", // ended 2024-06
      "sample-milestone", // 2020-01-01
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
    expect(timeline.map((entry) => entry.slug)).toEqual([
      "salta-lab-winner",
      "no-own-page",
      "sample-milestone",
    ]);
  });
});

describe("getLearningEntries", () => {
  it("merges courses and certifications, most recent first", () => {
    const entries = getLearningEntries("en");

    expect(entries.map((entry) => entry.slug)).toEqual([
      "ongoing-course", // status in-progress, no endDate: sorts by startDate 2026-01
      "aws-cloud-practitioner", // issuedAt 2025-03-20
      "advanced-react-patterns", // endDate 2025-02
    ]);
  });

  it("resolves the requested locale and marks kind per entry", () => {
    const entries = getLearningEntries("es");
    const course = entries.find(
      (entry) => entry.slug === "advanced-react-patterns",
    );
    const certification = entries.find(
      (entry) => entry.slug === "aws-cloud-practitioner",
    );

    expect(course?.kind).toBe("course");
    expect(course?.name).toBe("Patrones avanzados de React");
    expect(certification?.kind).toBe("certification");
    expect(certification?.issuer).toBe("Amazon Web Services");
  });

  it("resolves a course's skill references to localized names", () => {
    const entries = getLearningEntries("en");
    const course = entries.find(
      (entry) => entry.slug === "advanced-react-patterns",
    );

    expect(course?.skills).toEqual([
      { slug: "rest-api-design", name: "REST API design" },
    ]);
  });
});

describe("hasMilestonePages", () => {
  it("is true once at least one milestone declares hasOwnPage", () => {
    expect(hasMilestonePages()).toBe(true);
  });
});

describe("getMilestoneBySlug", () => {
  it("returns null for an unknown slug", () => {
    expect(getMilestoneBySlug("does-not-exist", "en")).toBeNull();
  });

  it("returns full detail, resolving evidence labels and related projects", () => {
    const detail = getMilestoneBySlug("salta-lab-winner", "en");

    expect(detail?.title).toBe("Salta Lab winner");
    expect(detail?.type).toBe("contest");
    expect(detail?.evidence).toEqual([
      { url: "https://example.com", label: "Note", kind: "press" },
    ]);
    expect(detail?.relatedProjects.map((project) => project.slug)).toEqual([
      "beta",
    ]);
    expect(detail?.videoId).toBe("dQw4w9WgXcQ");
  });

  it("resolves the requested locale for related projects", () => {
    const detail = getMilestoneBySlug("salta-lab-winner", "es");
    expect(detail?.relatedProjects[0]?.title).toBe("Beta");
  });
});

describe("getAllPrerenderPaths", () => {
  it("includes the static routes plus one detail path per project per locale, plus milestone pages", () => {
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
        "/es/hitos/salta-lab-winner",
        "/en/milestones/salta-lab-winner",
      ]),
    );
    // Only "salta-lab-winner" has hasOwnPage: true — "no-own-page" is
    // deliberately excluded.
    expect(paths).not.toContain("/es/hitos/no-own-page");
    // 11 static routes (root + home/projects/career/learning/about x 2
    // locales) + 5 projects x 2 locales + 1 milestone with hasOwnPage x 2
    // locales = 23
    expect(paths).toHaveLength(23);
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

describe("getMilestoneBody", () => {
  it("loads the compiled MDX component for a fully bilingual milestone body", async () => {
    const result = await getMilestoneBody("sample-milestone", "es");
    expect(result?.locale).toBe("es");
    expect(result?.isFallback).toBe(false);
    expect(typeof result?.Component).toBe("function");
  });

  it("returns null for a milestone without a declared body", async () => {
    expect(await getMilestoneBody("salta-lab-winner", "en")).toBeNull();
  });

  it("returns null for an unknown milestone", async () => {
    expect(await getMilestoneBody("does-not-exist", "en")).toBeNull();
  });
});
