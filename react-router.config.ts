import type { Config } from "@react-router/dev/config";
import { getStaticPaths } from "./content/i18n/route-map";

export default {
  // No runtime server: the portfolio is fully static content stored in the repo.
  ssr: false,
  // Prerender every known static path (root redirect stub + both locales'
  // pages) at build time. Splat/not-found routes are dynamic by nature and
  // are covered by React Router's generated SPA fallback instead.
  prerender: {
    paths: () => getStaticPaths(),
    concurrency: 4,
  },
} satisfies Config;
