import { z } from "zod";

import { assertKnownRefs, assertUniqueSlugs } from "../schemas/collection";
import { courseSchema, type Course } from "../schemas/course";
import { type EntityType } from "../schemas/shared";
import { projects } from "./projects";
import { skills } from "./skills";

const knownSlugsByType: Partial<Record<EntityType, ReadonlySet<string>>> = {
  project: new Set(projects.map((project) => project.slug)),
  skill: new Set(skills.map((skill) => skill.slug)),
};

const coursesSchema = z.array(courseSchema).superRefine((allCourses, ctx) => {
  assertUniqueSlugs(allCourses, ctx, "course");
  allCourses.forEach((course, index) => {
    assertKnownRefs(
      course.skills,
      knownSlugsByType,
      ctx,
      [index, "skills"],
      `course "${course.slug}"`,
    );
    if (course.finalProject) {
      assertKnownRefs(
        [course.finalProject],
        knownSlugsByType,
        ctx,
        [index, "finalProject"],
        `course "${course.slug}"`,
      );
    }
  });
});

// No real course has been loaded yet — real entries are collected in Phase 8
// (see §18 of the project plan). Left empty rather than filled with
// placeholder data.
const rawCourses: unknown[] = [];

export const courses: Course[] = coursesSchema.parse(rawCourses);
