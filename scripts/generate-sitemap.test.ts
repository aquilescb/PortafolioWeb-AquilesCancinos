import { describe, expect, it } from "vitest";

import { buildSitemapXml } from "./generate-sitemap";

describe("buildSitemapXml", () => {
  it("excludes the root redirect stub", () => {
    const xml = buildSitemapXml(["/", "/es", "/en"]);

    expect(xml).not.toContain(
      "<loc>https://portafolio-web-aquiles-cancinos.vercel.app/</loc>",
    );
  });

  it("builds an absolute <loc> for every remaining path", () => {
    const xml = buildSitemapXml(["/", "/es", "/es/proyectos"]);

    expect(xml).toContain(
      "<loc>https://portafolio-web-aquiles-cancinos.vercel.app/es</loc>",
    );
    expect(xml).toContain(
      "<loc>https://portafolio-web-aquiles-cancinos.vercel.app/es/proyectos</loc>",
    );
  });

  it("declares the sitemap namespace and a valid urlset root", () => {
    const xml = buildSitemapXml(["/es"]);

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    );
    expect(xml.trim().endsWith("</urlset>")).toBe(true);
  });
});
