# 3. In-house i18n with locale-prefixed routes

- Status: Accepted
- Date: 2026-07-31

## Context

The portfolio must ship two full locales (`es`, `en`) with no server: the
locale is known at build time, one URL per page per language, and both
locales must never drift out of sync as content grows over years.

## Decision

No i18n library. `react-i18next` and similar add runtime resolution and
~40 KB gzip for a problem that is fully static here. Instead:

- **URLs.** Every page lives at `/es/...` and `/en/...`. `/` is a minimal
  prerendered stub with `<link rel="canonical" href="/es">`, a
  `<meta http-equiv="refresh">` fallback, and an instant redirect to `/es` at
  the edge via `vercel.json`. One canonical, English slug per entity; locale
  only changes the path segment, not the identity of the page.
- **Route generation.** `content/i18n/route-map.ts` maps a canonical route key
  (`home`, …) to its per-locale path segment. `app/routes.ts` mounts the same
  component file at both locales' paths from that single map — one component,
  two URLs, no duplicated route config as sections are added.
- **Locale detection.** No React context/provider. The locale is always the
  first path segment, so `useLocale()` derives it from `useLocation()`
  (client) and route `meta()` functions derive it from the `location` argument
  they already receive (build time). This avoids a redundant state layer on
  top of the router, which already owns the URL.
- **Dictionaries.** `content/i18n/dictionaries/{es,en}.ts`, with
  `en: typeof es`. A missing or extra key is a `tsc` error — the only
  synchronization mechanism, enforced in CI by `npm run typecheck`.
- **SEO tags.** `<link rel="canonical">` and hreflang alternates are emitted
  from the `meta()` export using a descriptor with `tagName: "link"`, not a
  separate `links()` export — `links()` receives no arguments and can't know
  which locale it's rendering for, while `meta()` receives `location`.
- **Language switcher.** Resolves the equivalent URL of the current page via
  the route map (`equivalentPath`), not just a prefix swap, so translating a
  non-home page keeps the visitor on the same page once one exists.

## Consequences

- Zero runtime cost: no i18n library, no context provider, no client-side
  locale resolution beyond parsing the URL that's already there.
- A missing translation fails the type check instead of shipping mixed-language
  output.
- Adding a page in both languages is one entry in `route-map.ts` plus one
  component file, not two.
- `/es/*` and `/en/*` unmatched paths, and any URL outside those prefixes,
  render the same localized not-found page (`app/routes/not-found.tsx`); since
  it isn't in the static prerender list, it's served through React Router's
  generated SPA fallback (`build/client/__spa-fallback.html`), which
  `vercel.json` rewrites unmatched requests to. This means broken URLs get a
  200 with `noindex`, not a true HTTP 404 — acceptable for now given the
  `noindex` tag prevents indexing; revisit if a static host without
  filesystem-priority rewrites is used.

## Alternatives considered

- **`react-i18next`.** Solves the same problem with a larger bundle and
  runtime resolution for content that never changes after build.
- **Locale via React context/provider.** Duplicates state the router already
  holds in the URL; adds a provider to thread through the tree for no benefit
  over reading the URL directly.
- **Unprefixed routes with an `Accept-Language` redirect.** Needs a runtime
  server to inspect headers; incompatible with `ssr: false`.
