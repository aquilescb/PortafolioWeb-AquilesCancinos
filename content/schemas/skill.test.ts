import { describe, expect, it } from "vitest";

import { skillSchema } from "./skill";

const valid = {
  slug: "rest-api-design",
  name: { es: "Diseño de APIs REST", en: "REST API design" },
  category: "backend",
  evidence: [{ type: "project", slug: "inventory-system" }],
} as const;

describe("skillSchema", () => {
  it("accepts a well-formed skill", () => {
    const result = skillSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects a skill with no evidence", () => {
    const result = skillSchema.safeParse({ ...valid, evidence: [] });
    expect(result.success).toBe(false);
  });

  it("rejects a skill missing a locale in its name", () => {
    const result = skillSchema.safeParse({
      ...valid,
      name: { es: "Diseño de APIs REST" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty category", () => {
    const result = skillSchema.safeParse({ ...valid, category: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a malformed slug", () => {
    const result = skillSchema.safeParse({ ...valid, slug: "REST_api" });
    expect(result.success).toBe(false);
  });
});
