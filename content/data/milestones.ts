import { z } from "zod";

import { assertKnownRefs, assertUniqueSlugs } from "../schemas/collection";
import { milestoneSchema, type Milestone } from "../schemas/milestone";
import { type EntityType } from "../schemas/shared";
import { projects } from "./projects";

const knownSlugsByType: Partial<Record<EntityType, ReadonlySet<string>>> = {
  project: new Set(projects.map((project) => project.slug)),
};

const milestonesSchema = z
  .array(milestoneSchema)
  .superRefine((allMilestones, ctx) => {
    assertUniqueSlugs(allMilestones, ctx, "milestone");
    allMilestones.forEach((milestone, index) => {
      assertKnownRefs(
        milestone.relatedProjects,
        knownSlugsByType,
        ctx,
        [index, "relatedProjects"],
        `milestone "${milestone.slug}"`,
      );
    });
  });

// No real milestone has been loaded yet — real entries (including Salta Lab)
// are collected in Phase 8 (see §18 of the project plan). Left empty rather
// than filled with placeholder data.
const rawMilestones: unknown[] = [];

export const milestones: Milestone[] = milestonesSchema.parse(rawMilestones);
