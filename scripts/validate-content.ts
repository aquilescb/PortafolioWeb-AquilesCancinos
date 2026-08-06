#!/usr/bin/env tsx
// The content layer's safety net (see docs/adr/0002 and
// docs/content-authoring.md). Schema conformance, duplicate slugs, relation
// integrity, locale parity, private-project/repository conflicts and
// external URL format are all enforced by Zod the moment
// `content/data/*.ts` is imported — a single dynamic import below surfaces
// every one of those as a readable report instead of a raw stack trace.
// The one thing Zod can't check on its own is whether a declared case
// study's `.mdx` file actually exists on disk, so that's checked here too.
import { existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { z } from "zod";

import type { Locale } from "../content/i18n/locale";
import type { Milestone } from "../content/schemas/milestone";
import type { Project } from "../content/schemas/project";

const CASE_STUDIES_DIR = join(process.cwd(), "content", "case-studies");
const MILESTONES_DIR = join(process.cwd(), "content", "milestones");
const LOCALES: Locale[] = ["es", "en"];

export function formatZodError(error: z.ZodError): string[] {
  return error.issues.map((issue) =>
    issue.path.length > 0
      ? `${issue.path.join(".")}: ${issue.message}`
      : issue.message,
  );
}

interface DeclaredBodyItem {
  slug: string;
  declaration?: { es: boolean; en: boolean };
}

// Shared by `checkCaseStudyFiles` and `checkMilestoneBodyFiles`: both check
// that a `localizedBodyDeclarationSchema` field's declared locales actually
// have an `.mdx` file on disk, something Zod alone can't verify.
function checkDeclaredBodyFiles(
  baseDir: string,
  relativeBaseDir: string,
  bodyLabel: string,
  ownerLabel: string,
  items: DeclaredBodyItem[],
): string[] {
  const errors: string[] = [];
  for (const item of items) {
    if (!item.declaration) continue;
    for (const locale of LOCALES) {
      if (!item.declaration[locale]) continue;
      const path = join(baseDir, item.slug, `${locale}.mdx`);
      if (!existsSync(path)) {
        errors.push(
          `${ownerLabel} "${item.slug}" declares a ${locale} ${bodyLabel} but ` +
            `${relativeBaseDir}/${item.slug}/${locale}.mdx is missing`,
        );
      }
    }
  }
  return errors;
}

export function checkCaseStudyFiles(projects: Project[]): string[] {
  return checkDeclaredBodyFiles(
    CASE_STUDIES_DIR,
    "content/case-studies",
    "case study",
    "project",
    projects.map((project) => ({
      slug: project.slug,
      declaration: project.caseStudy,
    })),
  );
}

export function checkMilestoneBodyFiles(milestones: Milestone[]): string[] {
  return checkDeclaredBodyFiles(
    MILESTONES_DIR,
    "content/milestones",
    "body",
    "milestone",
    milestones.map((milestone) => ({
      slug: milestone.slug,
      declaration: milestone.body,
    })),
  );
}

async function main(): Promise<void> {
  const errors: string[] = [];
  let projectCount = 0;
  let experienceCount = 0;
  let educationCount = 0;
  let milestoneCount = 0;
  let skillCount = 0;
  let courseCount = 0;
  let certificationCount = 0;

  try {
    // Importing these modules parses every entity (and, transitively, every
    // technology) with Zod: schema conformance, duplicate slugs, relation
    // integrity, locale parity, https-only URLs and the private/
    // repositoryUrl conflict all throw from here if anything is wrong.
    const { projects } = await import("../content/data/projects");
    const { experiences } = await import("../content/data/experience");
    const { education } = await import("../content/data/education");
    const { milestones } = await import("../content/data/milestones");
    const { skills } = await import("../content/data/skills");
    const { courses } = await import("../content/data/courses");
    const { certifications } = await import("../content/data/certifications");
    projectCount = projects.length;
    experienceCount = experiences.length;
    educationCount = education.length;
    milestoneCount = milestones.length;
    skillCount = skills.length;
    courseCount = courses.length;
    certificationCount = certifications.length;
    errors.push(...checkCaseStudyFiles(projects));
    errors.push(...checkMilestoneBodyFiles(milestones));
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.push(...formatZodError(error));
    } else {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  if (errors.length > 0) {
    console.error(`✖ content validation failed (${errors.length} issue(s)):\n`);
    for (const message of errors) console.error(`  - ${message}`);
    process.exitCode = 1;
    return;
  }

  console.log(
    `✓ content validation passed (${projectCount} project(s), ` +
      `${experienceCount} experience(s), ${educationCount} education entry(ies), ` +
      `${milestoneCount} milestone(s), ${skillCount} skill(s), ` +
      `${courseCount} course(s), ${certificationCount} certification(s))`,
  );
}

// Only run when executed directly (`tsx scripts/validate-content.ts`), not
// when imported by tests. Compared as file URLs (not raw paths) so this
// works on Windows too.
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  void main();
}
