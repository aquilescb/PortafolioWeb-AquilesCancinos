import type { Config } from "@react-router/dev/config";

export default {
  // No runtime server: the portfolio is fully static content stored in the repo.
  ssr: false,
  // Pre-render every static path at build time so each URL ships real HTML
  // (SEO, hreflang and LCP). Dynamic content paths are added in a later phase.
  prerender: true,
} satisfies Config;
