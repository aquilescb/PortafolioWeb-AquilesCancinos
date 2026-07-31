# 1. React Router framework mode with static pre-rendering

- Status: Accepted
- Date: 2026-07-31

## Context

The portfolio must be a plain React + Vite + React Router application with no
backend, while also meeting requirements that a client-rendered SPA cannot
satisfy on its own:

- Real HTML per page for search engines, in two languages.
- Per-page and per-language metadata, `canonical`, `hreflang` and JSON-LD.
- Route-level code splitting and a low initial JavaScript payload.
- Good LCP without a runtime server.

The repository was scaffolded from `create-react-router`, which uses React Router
8 in framework mode with `ssr: true`.

## Decision

Keep React Router framework mode and configure it for fully static output:

```ts
export default {
  ssr: false,
  prerender: true,
} satisfies Config;
```

Framework mode is React Router running on Vite; it adds `prerender`, per-route
generated types and per-route `meta`/`links` exports. No server is deployed: the
build emits static HTML and `.data` files under `build/client/`.

## Consequences

- Every route ships real HTML. SEO, hreflang and LCP requirements are met without
  additional tooling.
- `action` and `headers` exports are forbidden in all routes, since there is no
  runtime server. The site has no mutations, so this costs nothing.
- `loader` runs at build time for pre-rendered routes; that code never reaches
  the client bundle.
- `react-router.config.ts` will import the content layer to enumerate dynamic
  paths, so the content layer must be importable from Node without DOM
  dependencies.
- Hosting is interchangeable between any static host (Vercel, GitHub Pages).

## Alternatives considered

- **Plain Vite SPA with react-router.** Closest to the original stack wording,
  but serves an empty HTML shell to crawlers and needs extra SSG tooling to meet
  the SEO and performance requirements.
- **Runtime SSR on a serverless function.** Solves SEO but introduces a server to
  maintain and cold starts, with no benefit for content that only changes when
  the site is rebuilt.
