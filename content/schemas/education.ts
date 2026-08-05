import { z } from "zod";

import { isoDateSchema, localizedStringSchema, slugSchema } from "./shared";

export const EDUCATION_STATUSES = ["in-progress", "completed"] as const;

export const educationSchema = z.object({
  slug: slugSchema,
  institution: z.string().min(1),
  degree: localizedStringSchema,
  startDate: isoDateSchema,
  endDate: isoDateSchema.optional(),
  status: z.enum(EDUCATION_STATUSES),
  highlights: z.array(localizedStringSchema).default([]),
  focusAreas: z.array(z.string().min(1)).default([]),
  gpa: z.number().positive().optional(),
  distinctions: z.array(localizedStringSchema).default([]),
});

export type Education = z.infer<typeof educationSchema>;
export type EducationStatus = (typeof EDUCATION_STATUSES)[number];
