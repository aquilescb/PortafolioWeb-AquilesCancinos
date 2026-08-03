import type { RefinementCtx } from "zod";

import type { EntityRef, EntityType } from "./shared";

// Cross-item checks that a single entity's own Zod schema can't express:
// every entity collection must have unique slugs, and every `EntityRef` it
// holds must resolve to a real entity. Shared by `content/data/*.ts` so
// duplicate slugs and dangling relations fail as soon as the data module is
// imported, in dev, tests, the build, and `validate:content` alike.

export function assertUniqueSlugs<T extends { slug: string }>(
  items: readonly T[],
  ctx: RefinementCtx,
  entityLabel: string,
): void {
  const seenSlugs = new Set<string>();
  items.forEach((item, index) => {
    if (seenSlugs.has(item.slug)) {
      ctx.addIssue({
        code: "custom",
        path: [index, "slug"],
        message: `duplicate ${entityLabel} slug "${item.slug}"`,
      });
    }
    seenSlugs.add(item.slug);
  });
}

export function assertKnownRefs(
  refs: readonly EntityRef[],
  knownSlugsByType: Record<EntityType, ReadonlySet<string>>,
  ctx: RefinementCtx,
  path: (string | number)[],
  ownerLabel: string,
): void {
  refs.forEach((ref, refIndex) => {
    if (!knownSlugsByType[ref.type].has(ref.slug)) {
      ctx.addIssue({
        code: "custom",
        path: [...path, refIndex],
        message: `${ownerLabel} references unknown ${ref.type} "${ref.slug}"`,
      });
    }
  });
}
