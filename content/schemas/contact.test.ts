import { describe, expect, it } from "vitest";

import { contactSchema } from "./contact";

const valid = {
  email: "person@example.com",
  socials: [
    {
      url: "https://github.com/example",
      label: { es: "GitHub", en: "GitHub" },
      kind: "profile",
    },
  ],
} as const;

describe("contactSchema", () => {
  it("accepts a well-formed contact with no location or availability", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("defaults socials to an empty array when omitted", () => {
    const result = contactSchema.safeParse({ email: valid.email });
    expect(result.success).toBe(true);
    expect(result.success && result.data.socials).toEqual([]);
  });

  it("rejects a malformed email", () => {
    expect(
      contactSchema.safeParse({ ...valid, email: "not-an-email" }).success,
    ).toBe(false);
  });

  it("rejects a social link using an insecure protocol", () => {
    expect(
      contactSchema.safeParse({
        ...valid,
        socials: [{ ...valid.socials[0], url: "http://github.com/example" }],
      }).success,
    ).toBe(false);
  });

  it("rejects an unknown social link kind", () => {
    expect(
      contactSchema.safeParse({
        ...valid,
        socials: [{ ...valid.socials[0], kind: "repo" }],
      }).success,
    ).toBe(false);
  });

  it("accepts optional location and availability when provided", () => {
    expect(
      contactSchema.safeParse({
        ...valid,
        location: { es: "Salta, Argentina", en: "Salta, Argentina" },
        availability: { es: "Disponible", en: "Available" },
      }).success,
    ).toBe(true);
  });
});
