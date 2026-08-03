import { z } from "zod";

import { assertUniqueSlugs } from "../schemas/collection";
import { technologySchema, type Technology } from "../schemas/technology";

const technologiesSchema = z
  .array(technologySchema)
  .superRefine((allTechnologies, ctx) =>
    assertUniqueSlugs(allTechnologies, ctx, "technology"),
  );

// The stack this portfolio itself is built with — real and verifiable from
// `package.json`. Grows as projects reference more technologies.
const rawTechnologies = [
  {
    slug: "typescript",
    name: "TypeScript",
    category: "language",
    level: "working",
  },
  {
    slug: "react-router",
    name: "React Router",
    category: "framework",
    level: "working",
  },
  {
    slug: "tailwind-css",
    name: "Tailwind CSS",
    category: "framework",
    level: "working",
  },
  { slug: "zod", name: "Zod", category: "tool", level: "working" },
] as const;

export const technologies: Technology[] =
  technologiesSchema.parse(rawTechnologies);
