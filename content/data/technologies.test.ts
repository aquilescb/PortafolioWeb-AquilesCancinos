import { describe, expect, it } from "vitest";

import { technologies } from "./technologies";

describe("technologies", () => {
  it("parses without throwing and exposes the stack this site is built with", () => {
    expect(technologies.map((technology) => technology.slug)).toEqual(
      expect.arrayContaining([
        "typescript",
        "react-router",
        "tailwind-css",
        "zod",
      ]),
    );
  });
});
