import { describe, expect, it } from "vitest";

import { courseSchema } from "./course";

const valid = {
  slug: "advanced-react-patterns",
  name: { es: "Patrones avanzados de React", en: "Advanced React patterns" },
  provider: "Frontend Masters",
  startDate: "2025-01",
  status: "completed",
  category: "frontend",
  relevance: 3,
  featured: true,
} as const;

describe("courseSchema", () => {
  it("accepts a well-formed course", () => {
    const result = courseSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts a course with an endDate on or after startDate", () => {
    const result = courseSchema.safeParse({
      ...valid,
      startDate: "2025-01-01",
      endDate: "2025-02-15",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an endDate before startDate", () => {
    const result = courseSchema.safeParse({
      ...valid,
      startDate: "2025-02-15",
      endDate: "2025-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a skills and finalProject reference", () => {
    const result = courseSchema.safeParse({
      ...valid,
      skills: [{ type: "skill", slug: "rest-api-design" }],
      finalProject: { type: "project", slug: "inventory-system" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects a relevance outside 1-3", () => {
    const result = courseSchema.safeParse({ ...valid, relevance: 4 });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid status", () => {
    const result = courseSchema.safeParse({ ...valid, status: "planned" });
    expect(result.success).toBe(false);
  });

  it("rejects a non-https verificationUrl", () => {
    const result = courseSchema.safeParse({
      ...valid,
      verificationUrl: "http://example.com/verify",
    });
    expect(result.success).toBe(false);
  });
});
