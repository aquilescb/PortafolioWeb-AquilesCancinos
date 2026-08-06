import { describe, expect, it } from "vitest";

import { skills } from "./skills";

describe("skills", () => {
  it("parses without throwing (empty until Phase 8 loads real skills)", () => {
    expect(skills).toEqual([]);
  });
});
