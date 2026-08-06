import { describe, expect, it } from "vitest";

import { certifications } from "./certifications";

describe("certifications", () => {
  it("parses without throwing (empty until Phase 8 loads real certifications)", () => {
    expect(certifications).toEqual([]);
  });
});
