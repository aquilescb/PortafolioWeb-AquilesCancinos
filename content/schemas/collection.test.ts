import { z } from "zod";
import { describe, expect, it } from "vitest";

import { assertKnownRefs, assertUniqueSlugs } from "./collection";
import type { EntityType } from "./shared";

const itemSchema = z.object({ slug: z.string() });

const itemsSchema = z
  .array(itemSchema)
  .superRefine((items, ctx) => assertUniqueSlugs(items, ctx, "item"));

describe("assertUniqueSlugs", () => {
  it("passes when every slug is unique", () => {
    const result = itemsSchema.safeParse([{ slug: "a" }, { slug: "b" }]);
    expect(result.success).toBe(true);
  });

  it("fails with a clear message when a slug repeats", () => {
    const result = itemsSchema.safeParse([{ slug: "a" }, { slug: "a" }]);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('duplicate item slug "a"');
    }
  });
});

const refsSchema = z
  .object({
    refs: z.array(
      z.object({ type: z.literal("technology"), slug: z.string() }),
    ),
  })
  .superRefine((value, ctx) =>
    assertKnownRefs(
      value.refs,
      { technology: new Set(["typescript"]) } satisfies Partial<
        Record<EntityType, ReadonlySet<string>>
      >,
      ctx,
      ["refs"],
      "owner",
    ),
  );

describe("assertKnownRefs", () => {
  it("passes when every ref resolves to a known slug", () => {
    const result = refsSchema.safeParse({
      refs: [{ type: "technology", slug: "typescript" }],
    });
    expect(result.success).toBe(true);
  });

  it("fails with a clear message when a ref points nowhere", () => {
    const result = refsSchema.safeParse({
      refs: [{ type: "technology", slug: "cobol" }],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        'owner references unknown technology "cobol"',
      );
    }
  });

  it("fails every ref of a type missing from a partial known-slugs map", () => {
    const partialRefsSchema = z
      .object({
        refs: z.array(
          z.object({ type: z.literal("project"), slug: z.string() }),
        ),
      })
      .superRefine((value, ctx) =>
        assertKnownRefs(
          value.refs,
          {} satisfies Partial<Record<EntityType, ReadonlySet<string>>>,
          ctx,
          ["refs"],
          "owner",
        ),
      );

    const result = partialRefsSchema.safeParse({
      refs: [{ type: "project", slug: "inventory-system" }],
    });
    expect(result.success).toBe(false);
  });
});
