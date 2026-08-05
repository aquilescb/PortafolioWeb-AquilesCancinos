import { describe, expect, it } from "vitest";

import { education } from "./education";

describe("education", () => {
  it("parses without throwing (empty until Phase 8 loads real education)", () => {
    expect(education).toEqual([]);
  });
});
