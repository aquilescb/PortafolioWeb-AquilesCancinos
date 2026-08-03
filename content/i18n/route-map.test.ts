import { describe, expect, it } from "vitest";

import {
  equivalentPath,
  getStaticPaths,
  localizedPath,
  projectDetailPath,
} from "./route-map";

describe("localizedPath", () => {
  it("builds the home path for each locale without a trailing segment", () => {
    expect(localizedPath("home", "es")).toBe("/es");
    expect(localizedPath("home", "en")).toBe("/en");
  });

  it("builds the localized projects path for each locale", () => {
    expect(localizedPath("projects", "es")).toBe("/es/proyectos");
    expect(localizedPath("projects", "en")).toBe("/en/projects");
  });
});

describe("projectDetailPath", () => {
  it("appends the slug to the localized projects path", () => {
    expect(projectDetailPath("inventory-system", "es")).toBe(
      "/es/proyectos/inventory-system",
    );
    expect(projectDetailPath("inventory-system", "en")).toBe(
      "/en/projects/inventory-system",
    );
  });
});

describe("getStaticPaths", () => {
  it("includes the root redirect stub and every route key in every locale", () => {
    expect(getStaticPaths()).toEqual([
      "/",
      "/es",
      "/es/proyectos",
      "/en",
      "/en/projects",
    ]);
  });
});

describe("equivalentPath", () => {
  it("maps the home page to the other locale's home page", () => {
    expect(equivalentPath("/es", "en")).toBe("/en");
    expect(equivalentPath("/en", "es")).toBe("/es");
  });

  it("falls back to the target locale's home for an unrecognised path", () => {
    expect(equivalentPath("/es/does-not-exist", "en")).toBe("/en");
    expect(equivalentPath("/not-locale-prefixed", "es")).toBe("/es");
  });
});
