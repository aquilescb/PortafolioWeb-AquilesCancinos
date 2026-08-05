import { z } from "zod";

import {
  entityRefSchema,
  httpsUrlSchema,
  localizedBodyDeclarationSchema,
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
    caseStudy: localizedBodyDeclarationSchema.optional(),
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
