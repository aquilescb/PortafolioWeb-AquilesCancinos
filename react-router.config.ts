import type { Config } from "@react-router/dev/config";
import { getAllPrerenderPaths } from "./content";

export default {
  // No runtime server: the portfolio is fully static content stored in the repo.
  ssr: false,
  // Prerender every known static path (root redirect stub + both locales'
  // pages, plus content-driven paths once Phase 4 adds entity routes) at
  // build time. Splat/not-found routes are dynamic by nature and are covered
  // by React Router's generated SPA fallback instead.
  prerender: {
    paths: () => getAllPrerenderPaths(),
    concurrency: 4,
  },
} satisfies Config;
