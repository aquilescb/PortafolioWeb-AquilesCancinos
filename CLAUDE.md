# CLAUDE.md

Permanent rules for this repository. Read before making any change.

## Project

Bilingual (es/en) professional portfolio for Aquiles Cancinos. It is a long-lived
record of his work in software: projects, case studies, education, courses,
certifications, milestones and press. Frontend only, no backend.

## Language convention

- **English, always:** file and folder names, variables, functions, components,
  types, schemas, technical slugs, branches, commits, pull requests, tests and
  technical comments.
- **Spanish and English, always both:** every piece of public-facing content —
  navigation, headings, descriptions, entities, SEO metadata, UI messages, 404
  and forms.
- Technical documentation and ADRs are written in English. Editorial or personal
  notes may be in Spanish. Each file stays consistent in one language.

## Architecture rules

- **No backend.** No database, no auth, no admin panel, no CMS, no Supabase,
  Firebase or Prisma. Content lives in the repository.
- **Static output.** `ssr: false` with `prerender` in `react-router.config.ts`.
  Because there is no runtime server, `action` and `headers` exports are
  forbidden in every route. Use `loader` (runs at build time) instead.
- **Content is decoupled from components.** Nothing under `app/` may import from
  `content/data/*`. All reads go through the public API in `content/index.ts`.
  This is enforced by an ESLint rule.
- Structured entities are TypeScript validated with Zod. Long-form prose is MDX,
  one file per locale. UI strings live in typed dictionaries where the English
  dictionary is typed as `typeof es`, so a missing translation fails typecheck.

## Content rules

- **Never invent** metrics, clients, roles, dates or outcomes. A field without a
  real, verifiable value is left empty or omitted.
- Do not describe Aquiles as a graduated engineer. He is an advanced Computer
  Engineering student. Avoid "Senior" and "Expert".
- Never publish private repository URLs, client code, credentials, ID documents,
  signatures or addresses. Projects marked `visibility: private` must not carry a
  `repositoryUrl`.
- No skill bars or arbitrary percentages. Skills are shown with linked evidence.
- The home page shows exactly three featured projects.

## Design rules

Editorial-technical direction: off-white paper, ink text, one accent colour,
generous whitespace, hairline rules, serif display plus sans UI.

Forbidden: hacker aesthetics, generic black backgrounds, neon green, particles,
3D effects, carousels, heavy gradients, excessive animation.

Motion is limited to `opacity` and `transform`, under 200 ms, and must respect
`prefers-reduced-motion`.

## Quality gates

Every change must keep these green:

```bash
npm run lint
npm run format:check
npm run typecheck
npm run test
npm run build
```

Accessibility target is WCAG 2.2 AA: semantic HTML, one `h1` per page, visible
focus (never `outline: none`), full keyboard navigation, contrast 4.5:1 or
better, correct `lang` attributes.

Performance budgets: initial JS ≤ 110 KB gzip, CSS ≤ 15 KB gzip, at most two
self-hosted font files, LCP ≤ 2 s, CLS ≤ 0.05, INP ≤ 200 ms.

## Git workflow

- `main` is always stable and protected. Work on `feat/*`, `fix/*`, `refactor/*`,
  `docs/*`, `chore/*` or `ci/*` branches, one pull request per phase.
- Conventional Commits in English. Atomic commits; each one leaves the project
  building. Never create commits just to add activity.
- Show what a commit will contain before creating it.
- Record significant decisions as an ADR under `docs/adr/`.
