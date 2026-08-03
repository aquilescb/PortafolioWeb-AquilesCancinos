import { z } from "zod";

import {
  entityRefSchema,
  httpsUrlSchema,
  localizedStringSchema,
  slugSchema,
} from "./shared";

export const PROJECT_STATUSES = ["active", "completed", "archived"] as const;
export const PROJECT_TIERS = ["featured", "main", "complementary"] as const;
export const PROJECT_CONTEXTS = [
  "professional",
  "personal",
  "academic",
  "experimental",
] as const;
export const PROJECT_VISIBILITIES = ["public", "private"] as const;

// Declares which locales have a full-length MDX case study for this project,
// under `content/case-studies/<slug>/<locale>.mdx`. The content validator
// checks the declared files actually exist; `getCaseStudy` in
// `content/index.ts` loads them (with a same-language fallback when only one
// locale is declared).
const caseStudySchema = z
  .object({ es: z.boolean(), en: z.boolean() })
  .refine((value) => value.es || value.en, {
    message: "caseStudy must declare at least one locale",
  });

export const projectSchema = z
  .object({
    slug: slugSchema,
    title: localizedStringSchema,
    summary: localizedStringSchema,
    problem: localizedStringSchema,
    year: z.number().int().min(2000),
    duration: localizedStringSchema.optional(),
    status: z.enum(PROJECT_STATUSES),
    tier: z.enum(PROJECT_TIERS),
    context: z.enum(PROJECT_CONTEXTS),
    organization: z.string().min(1).optional(),
    role: localizedStringSchema,
    teamSize: z.number().int().positive().optional(),
    technologies: z.array(entityRefSchema).min(1),
    categories: z.array(z.string().min(1)).min(1),
    visibility: z.enum(PROJECT_VISIBILITIES),
    repositoryUrl: httpsUrlSchema.optional(),
    demoUrl: httpsUrlSchema.optional(),
    cover: z.string().min(1),
    screenshots: z.array(z.string().min(1)).default([]),
    videoId: z.string().min(1).optional(),
    caseStudy: caseStudySchema.optional(),
    featuredOrder: z.number().int().positive().optional(),
  })
  .refine(
    (project) =>
      project.visibility !== "private" || project.repositoryUrl === undefined,
    {
      message: "a private project must not carry a repositoryUrl",
      path: ["repositoryUrl"],
    },
  );

export type Project = z.infer<typeof projectSchema>;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export type ProjectTier = (typeof PROJECT_TIERS)[number];
export type ProjectContext = (typeof PROJECT_CONTEXTS)[number];
export type ProjectVisibility = (typeof PROJECT_VISIBILITIES)[number];
