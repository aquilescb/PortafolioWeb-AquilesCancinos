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
  // Partial, not a full `Record`: a data file only has to supply the known-
  // slug sets for the entity types it actually references (e.g. `projects.ts`
  // shouldn't have to enumerate a `milestone` set it never points at). A
  // type with no entry here has no known slugs, so any ref of that type
  // fails — the safe default, not a silent pass.
  knownSlugsByType: Partial<Record<EntityType, ReadonlySet<string>>>,
  ctx: RefinementCtx,
  path: (string | number)[],
  ownerLabel: string,
): void {
  refs.forEach((ref, refIndex) => {
    if (!(knownSlugsByType[ref.type] ?? new Set()).has(ref.slug)) {
      ctx.addIssue({
        code: "custom",
        path: [...path, refIndex],
        message: `${ownerLabel} references unknown ${ref.type} "${ref.slug}"`,
      });
    }
  });
}
