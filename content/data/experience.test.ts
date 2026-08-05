import { describe, expect, it } from "vitest";

import { experiences } from "./experience";

describe("experiences", () => {
  it("parses without throwing (empty until Phase 8 loads real experience)", () => {
    expect(experiences).toEqual([]);
  });
});
