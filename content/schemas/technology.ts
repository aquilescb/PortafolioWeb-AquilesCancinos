import { z } from "zod";

import { slugSchema } from "./shared";

export const TECHNOLOGY_CATEGORIES = [
  "language",
  "framework",
  "database",
  "infra",
  "tool",
] as const;

// Never a percentage: how comfortable Aquiles is with the technology, shown
// as evidence-backed text rather than a skill bar.
export const TECHNOLOGY_LEVELS = ["working", "proficient", "core"] as const;

export const technologySchema = z.object({
  slug: slugSchema,
  name: z.string().min(1),
  category: z.enum(TECHNOLOGY_CATEGORIES),
  icon: z.string().min(1).optional(),
  level: z.enum(TECHNOLOGY_LEVELS),
});

export type Technology = z.infer<typeof technologySchema>;
