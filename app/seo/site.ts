// Single source of truth for the production origin: used by JSON-LD (needs
// absolute URLs) and `scripts/generate-sitemap.ts`. Update here when the
// domain changes (plan §17, pending decision before Phase 7) — `robots.txt`
// is a static file and has to be kept in sync by hand since it can't import
// this constant.
export const SITE_URL = "https://portafolio-web-aquiles-cancinos.vercel.app";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}
