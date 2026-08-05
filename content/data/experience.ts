import { z } from "zod";

import { assertKnownRefs, assertUniqueSlugs } from "../schemas/collection";
import { experienceSchema, type Experience } from "../schemas/experience";
import { type EntityType } from "../schemas/shared";
import { technologies } from "./technologies";

const knownSlugsByType: Partial<Record<EntityType, ReadonlySet<string>>> = {
  technology: new Set(technologies.map((technology) => technology.slug)),
};

const experiencesSchema = z
  .array(experienceSchema)
  .superRefine((allExperiences, ctx) => {
    assertUniqueSlugs(allExperiences, ctx, "experience");
    allExperiences.forEach((experience, index) => {
      assertKnownRefs(
        experience.technologies,
        knownSlugsByType,
        ctx,
        [index, "technologies"],
        `experience "${experience.slug}"`,
      );
    });
  });

// No real experience has been loaded yet — real entries are collected in
// Phase 8 (see §18 of the project plan). Left empty rather than filled with
// placeholder data.
const rawExperiences: unknown[] = [];

export const experiences: Experience[] =
  experiencesSchema.parse(rawExperiences);
