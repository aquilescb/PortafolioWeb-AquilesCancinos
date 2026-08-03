import { describe, expect, it } from "vitest";

import {
  entityRefSchema,
  httpsUrlSchema,
  localizedStringSchema,
  slugSchema,
} from "./shared";

describe("slugSchema", () => {
  it("accepts lowercase kebab-case slugs", () => {
    expect(slugSchema.safeParse("inventory-system").success).toBe(true);
  });

  it.each(["Inventory-System", "inventory_system", "inventory system", ""])(
    "rejects %s",
    (value) => {
      expect(slugSchema.safeParse(value).success).toBe(false);
    },
  );
});

describe("localizedStringSchema", () => {
  it("requires both locales to be non-empty", () => {
    expect(
      localizedStringSchema.safeParse({ es: "Hola", en: "Hello" }).success,
    ).toBe(true);
    expect(
      localizedStringSchema.safeParse({ es: "Hola", en: "" }).success,
    ).toBe(false);
    expect(localizedStringSchema.safeParse({ es: "Hola" }).success).toBe(false);
  });
});

describe("httpsUrlSchema", () => {
  it("accepts absolute https urls", () => {
    expect(
      httpsUrlSchema.safeParse("https://github.com/aquilescb/example").success,
    ).toBe(true);
  });

  it.each([
    "http://github.com/aquilescb/example",
    "github.com/aquilescb",
    "not a url",
  ])("rejects %s", (value) => {
    expect(httpsUrlSchema.safeParse(value).success).toBe(false);
  });
});

describe("entityRefSchema", () => {
  it("accepts a known entity type with a valid slug", () => {
    expect(
      entityRefSchema.safeParse({ type: "technology", slug: "react-router" })
        .success,
    ).toBe(true);
  });

  it("rejects an unknown entity type", () => {
    expect(
      entityRefSchema.safeParse({ type: "course", slug: "react-router" })
        .success,
    ).toBe(false);
  });
});
