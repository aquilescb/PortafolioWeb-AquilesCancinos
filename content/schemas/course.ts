import { z } from "zod";

import {
  entityRefSchema,
  httpsUrlSchema,
  isoDateSchema,
  localizedStringSchema,
  slugSchema,
} from "./shared";

export const COURSE_STATUSES = ["in-progress", "completed"] as const;

// Kept as a plain `z.object` (not `.refine`d) so `certification.ts` can
// `.extend()` it — Zod effects (the result of `.refine`) can't be extended.
// The shared endDate-after-startDate rule is applied by each leaf schema
// instead (see `courseSchema` below and `certificationSchema`).
export const courseObjectSchema = z.object({
  slug: slugSchema,
  name: localizedStringSchema,
  provider: z.string().min(1),
  startDate: isoDateSchema,
  endDate: isoDateSchema.optional(),
  hours: z.number().int().positive().optional(),
  status: z.enum(COURSE_STATUSES),
  // Free text, not an enum: groups the "complementary formation" list on
  // `/formacion` — mirrors `Skill.category` (see that file's comment).
  category: z.string().min(1),
  skills: z.array(entityRefSchema).default([]),
  // Without this, a certificate is just a self-reported claim — critical
  // enough that content authoring should always try to include it, but not
  // every course platform issues one, so it stays optional at the schema
  // level.
  verificationUrl: httpsUrlSchema.optional(),
  credentialId: z.string().min(1).optional(),
  relevance: z.number().int().min(1).max(3),
  featured: z.boolean(),
  finalProject: entityRefSchema.optional(),
});

export const courseSchema = courseObjectSchema.refine(
  (course) => !course.endDate || course.endDate >= course.startDate,
  { message: "endDate must not precede startDate", path: ["endDate"] },
);

export type Course = z.infer<typeof courseSchema>;
export type CourseStatus = (typeof COURSE_STATUSES)[number];
