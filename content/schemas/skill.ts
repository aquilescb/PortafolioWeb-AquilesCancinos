import { z } from "zod";

import { entityRefSchema, localizedStringSchema, slugSchema } from "./shared";

export const skillSchema = z.object({
  slug: slugSchema,
  name: localizedStringSchema,
  // Free text, not an enum: mirrors `Project.categories` rather than
  // `Technology.category` — the real grouping only becomes clear once real
  // skills are loaded in Phase 8, and a guessed enum would just get in the
  // way of that.
  category: z.string().min(1),
  // Evidence over self-reported claims, same principle as `Milestone`
  // (CLAUDE.md content rules): a skill with no real project behind it isn't
  // shown as a skill bar, it isn't shown at all. Restricted to `project`
  // refs (not `course`) so the content graph stays acyclic — a course is
  // where a skill was learned, not evidence that it was applied.
  evidence: z.array(entityRefSchema).min(1),
});

export type Skill = z.infer<typeof skillSchema>;
