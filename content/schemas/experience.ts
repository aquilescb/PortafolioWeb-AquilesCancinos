import { z } from "zod";

import {
  entityRefSchema,
  isoDateSchema,
  localizedStringSchema,
  slugSchema,
} from "./shared";

export const EXPERIENCE_TYPES = [
  "employment",
  "freelance",
  "internship",
  "volunteer",
] as const;

export const experienceSchema = z
  .object({
    slug: slugSchema,
    organization: z.string().min(1),
    role: localizedStringSchema,
    type: z.enum(EXPERIENCE_TYPES),
    startDate: isoDateSchema,
    endDate: isoDateSchema.optional(),
    responsibilities: z.array(localizedStringSchema).min(1),
    achievements: z.array(localizedStringSchema).default([]),
    technologies: z.array(entityRefSchema).default([]),
  })
  .refine(
    (experience) =>
      !experience.endDate || experience.endDate >= experience.startDate,
    { message: "endDate must not precede startDate", path: ["endDate"] },
  );

export type Experience = z.infer<typeof experienceSchema>;
export type ExperienceType = (typeof EXPERIENCE_TYPES)[number];
