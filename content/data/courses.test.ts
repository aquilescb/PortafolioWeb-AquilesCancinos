import { describe, expect, it } from "vitest";

import { courses } from "./courses";

describe("courses", () => {
  it("parses without throwing (empty until Phase 8 loads real courses)", () => {
    expect(courses).toEqual([]);
  });
});
