import { z } from "zod";

import {
  entityRefSchema,
  externalLinkSchema,
  isoDateSchema,
  localizedBodyDeclarationSchema,
  localizedStringSchema,
  slugSchema,
} from "./shared";

export const MILESTONE_TYPES = [
  "award",
  "contest",
  "hackathon",
  "talk",
  "press",
  "publication",
  "conference",
] as const;

export const milestoneSchema = z
  .object({
    slug: slugSchema,
    title: localizedStringSchema,
    type: z.enum(MILESTONE_TYPES),
    date: isoDateSchema,
    organization: z.string().min(1).optional(),
    summary: localizedStringSchema,
    body: localizedBodyDeclarationSchema.optional(),
    hasOwnPage: z.boolean(),
    // Evidence over self-reported claims: a milestone with no external link
    // backing it up isn't content, it's an unverifiable assertion
    // (CLAUDE.md content rules).
    evidence: z.array(externalLinkSchema).min(1),
    videoId: z.string().min(1).optional(),
    relatedProjects: z.array(entityRefSchema).default([]),
  })
  .refine(
    (milestone) => !milestone.hasOwnPage || milestone.body !== undefined,
    {
      message: "a milestone with hasOwnPage must declare a body",
      path: ["body"],
    },
  );

export type Milestone = z.infer<typeof milestoneSchema>;
export type MilestoneType = (typeof MILESTONE_TYPES)[number];
