import { z } from "zod";

import {
  certificationSchema,
  type Certification,
} from "../schemas/certification";
import { assertKnownRefs, assertUniqueSlugs } from "../schemas/collection";
import { type EntityType } from "../schemas/shared";
import { projects } from "./projects";
import { skills } from "./skills";

const knownSlugsByType: Partial<Record<EntityType, ReadonlySet<string>>> = {
  project: new Set(projects.map((project) => project.slug)),
  skill: new Set(skills.map((skill) => skill.slug)),
};

const certificationsSchema = z
  .array(certificationSchema)
  .superRefine((allCertifications, ctx) => {
    assertUniqueSlugs(allCertifications, ctx, "certification");
    allCertifications.forEach((certification, index) => {
      assertKnownRefs(
        certification.skills,
        knownSlugsByType,
        ctx,
        [index, "skills"],
        `certification "${certification.slug}"`,
      );
      if (certification.finalProject) {
        assertKnownRefs(
          [certification.finalProject],
          knownSlugsByType,
          ctx,
          [index, "finalProject"],
          `certification "${certification.slug}"`,
        );
      }
    });
  });

// No real certification has been loaded yet — real entries are collected in
// Phase 8 (see §18 of the project plan). Left empty rather than filled with
// placeholder data.
const rawCertifications: unknown[] = [];

export const certifications: Certification[] =
  certificationsSchema.parse(rawCertifications);
