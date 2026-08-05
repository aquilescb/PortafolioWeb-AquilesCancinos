import { z } from "zod";

import { assertUniqueSlugs } from "../schemas/collection";
import { educationSchema, type Education } from "../schemas/education";

const educationCollectionSchema = z
  .array(educationSchema)
  .superRefine((allEducation, ctx) =>
    assertUniqueSlugs(allEducation, ctx, "education"),
  );

// No real education entry has been loaded yet — real entries are collected
// in Phase 8 (see §18 of the project plan). Left empty rather than filled
// with placeholder data.
const rawEducation: unknown[] = [];

export const education: Education[] =
  educationCollectionSchema.parse(rawEducation);
