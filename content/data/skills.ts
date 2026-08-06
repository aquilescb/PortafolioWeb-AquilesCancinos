import { z } from "zod";

import { assertKnownRefs, assertUniqueSlugs } from "../schemas/collection";
import { type EntityType } from "../schemas/shared";
import { skillSchema, type Skill } from "../schemas/skill";
import { projects } from "./projects";

const knownSlugsByType: Partial<Record<EntityType, ReadonlySet<string>>> = {
  project: new Set(projects.map((project) => project.slug)),
};

const skillsSchema = z.array(skillSchema).superRefine((allSkills, ctx) => {
  assertUniqueSlugs(allSkills, ctx, "skill");
  allSkills.forEach((skill, index) => {
    assertKnownRefs(
      skill.evidence,
      knownSlugsByType,
      ctx,
      [index, "evidence"],
      `skill "${skill.slug}"`,
    );
  });
});

// No real skill has been loaded yet — real entries are collected in Phase 8
// (see §18 of the project plan). Left empty rather than filled with
// placeholder data.
const rawSkills: unknown[] = [];

export const skills: Skill[] = skillsSchema.parse(rawSkills);
