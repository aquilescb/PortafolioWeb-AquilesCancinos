import { z } from "zod";
import { describe, expect, it } from "vitest";

import type { Milestone } from "../content/schemas/milestone";
import type { Project } from "../content/schemas/project";
import {
  checkCaseStudyFiles,
  checkMilestoneBodyFiles,
  formatZodError,
} from "./validate-content";

function project(overrides: Partial<Project>): Project {
  return {
    slug: "sample",
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
    cover: "/cover.avif",
    screenshots: [],
    ...overrides,
  };
}

function milestone(overrides: Partial<Milestone>): Milestone {
  return {
    slug: "sample-milestone",
    title: { es: "Muestra", en: "Sample" },
    type: "contest",
    date: "2025-01-01",
    summary: { es: "Resumen", en: "Summary" },
    hasOwnPage: false,
    evidence: [
      {
        url: "https://example.com",
        label: { es: "Nota", en: "Note" },
        kind: "press",
      },
    ],
    relatedProjects: [],
    ...overrides,
  };
}

describe("formatZodError", () => {
  it("prefixes the message with the offending path", () => {
    const schema = z.object({ slug: z.string().min(1) });
    const result = schema.safeParse({ slug: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(formatZodError(result.error)).toEqual([
        expect.stringContaining("slug:"),
      ]);
    }
  });
});

describe("checkCaseStudyFiles", () => {
  it("passes for a project whose declared case study files exist", () => {
    const errors = checkCaseStudyFiles([
      project({
        slug: "content-pipeline-sample",
        caseStudy: { es: true, en: true },
      }),
    ]);
    expect(errors).toEqual([]);
  });

  it("reports a clear error for a declared case study with a missing file", () => {
    const errors = checkCaseStudyFiles([
      project({ slug: "does-not-exist", caseStudy: { es: true, en: false } }),
    ]);
    expect(errors).toEqual([
      'project "does-not-exist" declares a es case study but ' +
        "content/case-studies/does-not-exist/es.mdx is missing",
    ]);
  });

  it("ignores projects with no declared case study", () => {
    expect(checkCaseStudyFiles([project({})])).toEqual([]);
  });
});

describe("checkMilestoneBodyFiles", () => {
  it("passes for a milestone whose declared body files exist", () => {
    const errors = checkMilestoneBodyFiles([
      milestone({
        slug: "sample-milestone",
        hasOwnPage: true,
        body: { es: true, en: true },
      }),
    ]);
    expect(errors).toEqual([]);
  });

  it("reports a clear error for a declared body with a missing file", () => {
    const errors = checkMilestoneBodyFiles([
      milestone({
        slug: "does-not-exist",
        hasOwnPage: true,
        body: { es: true, en: false },
      }),
    ]);
    expect(errors).toEqual([
      'milestone "does-not-exist" declares a es body but ' +
        "content/milestones/does-not-exist/es.mdx is missing",
    ]);
  });

  it("ignores milestones with no declared body", () => {
    expect(checkMilestoneBodyFiles([milestone({})])).toEqual([]);
  });
});
