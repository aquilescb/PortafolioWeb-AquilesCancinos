import { describe, expect, it } from "vitest";

import { projects } from "./projects";

describe("projects", () => {
  it("parses without throwing (empty until Phase 4 loads real projects)", () => {
    expect(projects).toEqual([]);
  });
});
