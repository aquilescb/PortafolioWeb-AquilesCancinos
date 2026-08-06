import { describe, expect, it } from "vitest";

import { certificationSchema } from "./certification";

const valid = {
  slug: "aws-cloud-practitioner",
  name: { es: "AWS Cloud Practitioner", en: "AWS Cloud Practitioner" },
  provider: "AWS",
  startDate: "2025-03",
  status: "completed",
  category: "cloud",
  relevance: 3,
  featured: true,
  issuedAt: "2025-03-20",
  issuer: "Amazon Web Services",
} as const;

describe("certificationSchema", () => {
  it("accepts a well-formed certification", () => {
    const result = certificationSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts an expiresAt on or after issuedAt", () => {
    const result = certificationSchema.safeParse({
      ...valid,
      expiresAt: "2028-03-20",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an expiresAt before issuedAt", () => {
    const result = certificationSchema.safeParse({
      ...valid,
      expiresAt: "2024-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an endDate before startDate", () => {
    const result = certificationSchema.safeParse({
      ...valid,
      startDate: "2025-03-20",
      endDate: "2025-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing issuer", () => {
    const { issuer: _issuer, ...withoutIssuer } = valid;
    const result = certificationSchema.safeParse(withoutIssuer);
    expect(result.success).toBe(false);
  });

  it("inherits course validation, rejecting an invalid status", () => {
    const result = certificationSchema.safeParse({
      ...valid,
      status: "planned",
    });
    expect(result.success).toBe(false);
  });
});
