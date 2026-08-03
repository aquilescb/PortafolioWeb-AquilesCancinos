# Content authoring workflow

How to add content to the portfolio. See `docs/adr/0002-content-lives-in-the-repository.md`
for why the content layer is shaped this way.

## Layout

```
content/
├─ index.ts                # the only public API — app/** never imports content/data/* directly
├─ schemas/                # Zod schemas + inferred types, one file per entity
├─ data/                   # plain arrays of entities, Zod-parsed at import time
├─ case-studies/<slug>/    # long-form project prose, one .mdx file per locale
└─ i18n/                   # locale, route map, UI dictionaries (Phase 2)
```

Every entity is validated the moment its `content/data/*.ts` module is imported —
in `npm run dev`, in tests, in the build, and in `npm run validate:content`. A
malformed entity throws immediately with a Zod error, not a silent bad page.

## Adding a technology

Technologies are referenced by projects via `EntityRef` (`{ type: "technology", slug }`).
Add one to `content/data/technologies.ts`:

```ts
{ slug: "postgresql", name: "PostgreSQL", category: "database", level: "working" }
```

`level` is `working` / `proficient` / `core` — never a percentage (see CLAUDE.md).

## Adding a project

Append an entry to `rawProjects` in `content/data/projects.ts`. Every field is
validated by `projectSchema` (`content/schemas/project.ts`):

```ts
{
  slug: "inventory-system",
  title: { es: "Sistema de inventario", en: "Inventory system" },
  summary: { es: "…", en: "…" },
  problem: { es: "…", en: "…" },
  year: 2025,
  status: "completed",       // active | completed | archived
  tier: "featured",          // featured | main | complementary — home shows exactly 3 "featured"
  context: "professional",   // professional | personal | academic | experimental
  role: { es: "Desarrollador", en: "Developer" },
  technologies: [{ type: "technology", slug: "postgresql" }],
  categories: ["web"],
  visibility: "public",      // "private" projects must not carry a repositoryUrl — the schema rejects it
  repositoryUrl: "https://github.com/aquilescb/inventory-system",
  cover: "/images/inventory-system/cover.avif",
  screenshots: [],
  caseStudy: { es: true, en: true }, // see below — only if content/case-studies/<slug>/ exists
}
```

Rules enforced automatically:

- `title`, `summary`, `problem`, `role` and `duration` require **both** `es`
  and `en` — a missing translation fails validation.
- `repositoryUrl` / `demoUrl` must be absolute `https://` URLs.
- A `private` project cannot carry a `repositoryUrl`.
- Every project needs at least one technology, and every technology it
  references must actually exist in `content/data/technologies.ts`.
- Slugs must be unique within each entity collection.

## Adding a case study

`tier: "featured"` and `"main"` projects normally carry a full case study;
`"complementary"` projects don't. To add one:

1. Set `caseStudy: { es: true, en: true }` (or just one locale — see fallback
   below) on the project entry.
2. Create the MDX file(s): `content/case-studies/<slug>/es.mdx` and/or
   `en.mdx`. Write plain prose with headings — no frontmatter, the entity
   data already lives in `content/data/projects.ts`. Suggested sections:
   context, problem, architecture, technical decisions, challenges, solution,
   results, learnings.
3. `npm run validate:content` fails with a clear message if a locale is
   declared `true` but its `.mdx` file is missing.

**Translation fallback.** If only one locale is declared, `getCaseStudy` from
`content/index.ts` serves the other locale's MDX and reports
`isFallback: true`; the route that renders it is responsible for showing a
visible notice and setting `<meta name="robots" content="noindex">` on that
page (see the plan's §6.3). This is an accepted, intentional state — not a
validation error.

A worked, disposable example of this pipeline lives at
`content/case-studies/content-pipeline-sample/` (both locales) and
`content/case-studies/content-pipeline-sample-partial/` (Spanish only, to
exercise the fallback) — see `content/index.test.ts`. Neither is referenced
by a real project; they exist purely to test-drive the MDX pipeline before
real case studies are written in Phase 4.

## Reading content from a route

Never import `content/data/*` from `app/**` (an ESLint rule blocks it). Use
`content/index.ts` instead, and only from a route's `loader` — `ssr: false` +
prerender means `loader` code runs at build time and never reaches the
client bundle, so pulling in Zod, the MDX compiler or the full content
dataset there costs nothing in the browser:

```ts
import { getFeaturedProjects } from "@content";

export async function loader() {
  return { featured: getFeaturedProjects("es") };
}
```

## Validating content

```bash
npm run validate:content
```

Runs in CI on every PR and on `main` (see `.github/workflows/ci.yml`). It
re-parses every entity with Zod and additionally checks that every declared
case study's `.mdx` file exists on disk.
