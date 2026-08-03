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
import type { Project } from "../content/schemas/project";

const CASE_STUDIES_DIR = join(process.cwd(), "content", "case-studies");
const LOCALES: Locale[] = ["es", "en"];

export function formatZodError(error: z.ZodError): string[] {
  return error.issues.map((issue) =>
    issue.path.length > 0
      ? `${issue.path.join(".")}: ${issue.message}`
      : issue.message,
  );
}

export function checkCaseStudyFiles(projects: Project[]): string[] {
  const errors: string[] = [];
  for (const project of projects) {
    if (!project.caseStudy) continue;
    for (const locale of LOCALES) {
      if (!project.caseStudy[locale]) continue;
      const path = join(CASE_STUDIES_DIR, project.slug, `${locale}.mdx`);
      if (!existsSync(path)) {
        errors.push(
          `project "${project.slug}" declares a ${locale} case study but ` +
            `content/case-studies/${project.slug}/${locale}.mdx is missing`,
        );
      }
    }
  }
  return errors;
}

async function main(): Promise<void> {
  const errors: string[] = [];
  let projectCount = 0;

  try {
    // Importing this module parses every project (and, transitively, every
    // technology) with Zod: schema conformance, duplicate slugs, relation
    // integrity, locale parity, https-only URLs and the private/
    // repositoryUrl conflict all throw from here if anything is wrong.
    const { projects } = await import("../content/data/projects");
    projectCount = projects.length;
    errors.push(...checkCaseStudyFiles(projects));
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

  console.log(`✓ content validation passed (${projectCount} project(s))`);
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
