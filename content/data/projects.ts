import { z } from "zod";

import { assertKnownRefs, assertUniqueSlugs } from "../schemas/collection";
import { projectSchema, type Project } from "../schemas/project";
import { type EntityType } from "../schemas/shared";
import { technologies } from "./technologies";

const knownSlugsByType: Record<EntityType, ReadonlySet<string>> = {
  technology: new Set(technologies.map((technology) => technology.slug)),
};

const projectsSchema = z
  .array(projectSchema)
  .superRefine((allProjects, ctx) => {
    assertUniqueSlugs(allProjects, ctx, "project");
    allProjects.forEach((project, index) => {
      assertKnownRefs(
        project.technologies,
        knownSlugsByType,
        ctx,
        [index, "technologies"],
        `project "${project.slug}"`,
      );
    });
  });

// No real project content has been loaded yet — the three featured projects
// are collected in Phase 4 (see §18 of the project plan). Left empty rather
// than filled with placeholder data.
const rawProjects: unknown[] = [];

export const projects: Project[] = projectsSchema.parse(rawProjects);
