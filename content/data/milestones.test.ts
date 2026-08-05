import { describe, expect, it } from "vitest";

import { milestones } from "./milestones";

describe("milestones", () => {
  it("parses without throwing (empty until Phase 8 loads real milestones)", () => {
    expect(milestones).toEqual([]);
  });
});
