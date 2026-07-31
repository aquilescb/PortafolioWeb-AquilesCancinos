# 2. Content lives in the repository, typed and validated

- Status: Accepted
- Date: 2026-07-31

## Context

The portfolio must scale to hundreds of projects, courses and milestones, stay
maintainable for years, and support two languages — without a backend, database
or CMS. Content must not be written inside JSX.

## Decision

Store all content in the repository, split by shape:

| Content                                          | Format                                        |
| ------------------------------------------------ | --------------------------------------------- |
| Structured entities (projects, courses, …)       | TypeScript objects validated with Zod         |
| Long-form prose (case studies, milestone bodies) | MDX, one file per locale                      |
| UI strings                                       | Typed dictionaries, `en` typed as `typeof es` |

All of it lives under `content/` and is exposed through a single public API in
`content/index.ts`. Nothing under `app/` may import `content/data/*` directly;
an ESLint rule enforces this.

A `validate:content` script runs in CI and checks: schema conformance, duplicate
slugs, relation integrity (every `EntityRef` resolves), both locales present on
localized fields, declared MDX files exist, external URL format, and that no
project marked `private` carries a `repositoryUrl`.

## Consequences

- Authoring content gets editor autocomplete and compile-time safety; renaming or
  restructuring entities is a typed refactor.
- A missing translation fails the type check rather than shipping mixed-language
  output.
- Content errors fail the build instead of reaching production.
- Migrating to a CMS or API later means reimplementing the functions in
  `content/index.ts` as async; components stay untouched, and the Zod schemas
  move from validating local modules to validating network responses.

## When to revisit

Introduce a CMS, API or database only when one of these becomes true, not in
anticipation:

- Content must be edited without repository access.
- Builds consistently exceed roughly five minutes.
- Content must change without a deployment.
- Per-user data, authentication or persisted form submissions are required.
