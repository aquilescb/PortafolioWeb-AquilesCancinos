import type { LearningEntry } from "@content";

// Deliberately dependency-free and self-contained (only a type import from
// `@content`, erased at compile time — no runtime content-layer import):
// this module is loaded via `import()` only once the archive's search box
// is used (see `~/components/content/learning-archive`), so it must be safe
// to ship to the browser on its own, without pulling in `content/index.ts`
// (which imports `node:fs` for MDX and can't be bundled client-side).
//
// Plain case-insensitive substring matching, not a fuzzy-search library: the
// archive stays in the few-hundred-entry range (plan §5), so a linear scan
// over data the route already loaded is cheap, and it keeps this lazy chunk
// as small as possible.
function toHaystack(entry: LearningEntry): string {
  return [
    entry.name,
    entry.provider,
    entry.category,
    entry.issuer ?? "",
    ...entry.skills.map((skill) => skill.name),
  ]
    .join(" ")
    .toLowerCase();
}

export function searchLearningEntries(
  entries: LearningEntry[],
  query: string,
): LearningEntry[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return entries;
  return entries.filter((entry) => toHaystack(entry).includes(normalizedQuery));
}
