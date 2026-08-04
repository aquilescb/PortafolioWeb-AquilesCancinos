#!/usr/bin/env tsx
// Runs as `prebuild` (see package.json) so `public/sitemap.xml` exists
// before Vite copies `public/` into `build/client/`. Reads the exact same
// path list that feeds `react-router.config.ts`'s `prerender.paths()` (both
// call `getAllPrerenderPaths`), so the sitemap and the prerendered output
// can never drift apart (plan §12).
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { SITE_URL } from "../app/seo/site";
import { getAllPrerenderPaths } from "../content";

const OUTPUT_PATH = join(process.cwd(), "public", "sitemap.xml");

export function buildSitemapXml(paths: string[]): string {
  const urls = paths
    // "/" is the root redirect stub (noindex, meta-refreshes to /es) — not
    // a real page, so it doesn't belong in the sitemap.
    .filter((path) => path !== "/")
    .map((path) => `  <url>\n    <loc>${SITE_URL}${path}</loc>\n  </url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function main(): void {
  const paths = getAllPrerenderPaths();
  writeFileSync(OUTPUT_PATH, buildSitemapXml(paths), "utf-8");
  console.log(`✓ wrote ${paths.length - 1} URL(s) to public/sitemap.xml`);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main();
}
