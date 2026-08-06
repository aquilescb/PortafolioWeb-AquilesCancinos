import { describe, expect, it } from "vitest";

import {
  equivalentPath,
  getStaticPaths,
  localizedPath,
  milestoneDetailPath,
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

  it("builds the localized career path for each locale", () => {
    expect(localizedPath("career", "es")).toBe("/es/trayectoria");
    expect(localizedPath("career", "en")).toBe("/en/career");
  });

  it("builds the localized learning path for each locale", () => {
    expect(localizedPath("learning", "es")).toBe("/es/formacion");
    expect(localizedPath("learning", "en")).toBe("/en/learning");
  });

  it("builds the localized about path for each locale", () => {
    expect(localizedPath("about", "es")).toBe("/es/sobre-mi");
    expect(localizedPath("about", "en")).toBe("/en/about");
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

describe("milestoneDetailPath", () => {
  it("builds the milestone path under its own segment, not under career", () => {
    expect(milestoneDetailPath("salta-lab-winner", "es")).toBe(
      "/es/hitos/salta-lab-winner",
    );
    expect(milestoneDetailPath("salta-lab-winner", "en")).toBe(
      "/en/milestones/salta-lab-winner",
    );
  });
});

describe("getStaticPaths", () => {
  it("includes the root redirect stub and every route key in every locale", () => {
    expect(getStaticPaths()).toEqual([
      "/",
      "/es",
      "/es/proyectos",
      "/es/trayectoria",
      "/es/formacion",
      "/es/sobre-mi",
      "/en",
      "/en/projects",
      "/en/career",
      "/en/learning",
      "/en/about",
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
