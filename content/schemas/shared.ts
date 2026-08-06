import { z } from "zod";

import type { Locale } from "../i18n/locale";

// Kebab-case, URL-safe identifier shared by every entity (`project.slug`,
// `technology.slug`, and so on in later phases).
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug must be lowercase kebab-case");

// Short localized text (titles, summaries, roles). Both locales are required:
// a missing translation fails validation at parse time rather than shipping
// mixed-language content.
export const localizedStringSchema = z.object({
  es: z.string().min(1),
  en: z.string().min(1),
}) satisfies z.ZodType<Record<Locale, string>>;

// External links must be secure and absolute; no bare domains or relative
// paths, which would break Open Graph and JSON-LD consumers.
export const httpsUrlSchema = z
  .string()
  .url()
  .refine((value) => value.startsWith("https://"), {
    message: "url must use the https protocol",
  });

// Entity types that can be referenced by another entity. Extended as later
// phases introduce new referenceable entities (course...).
export const ENTITY_TYPES = ["technology", "project", "skill"] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

// A typed pointer to another entity. The content validator resolves every
// `EntityRef` against the real entity list so relations can never dangle.
export const entityRefSchema = z.object({
  type: z.enum(ENTITY_TYPES),
  slug: slugSchema,
});
export type EntityRef = z.infer<typeof entityRefSchema>;

// YYYY-MM-DD or YYYY-MM: some entities have an exact day (an award), others
// only a known month (a job that started "sometime in March"). Never widen
// this to accept a guess — an unknown date is left absent (CLAUDE.md).
export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}(-\d{2})?$/, "date must be YYYY-MM or YYYY-MM-DD");

// Declares which locales have full-length MDX prose for an entity — shared
// by `Project.caseStudy` and `Milestone.body`. The content validator checks
// the declared files actually exist; `content/index.ts` loads them (with a
// same-language fallback when only one locale is declared).
export const localizedBodyDeclarationSchema = z
  .object({ es: z.boolean(), en: z.boolean() })
  .refine((value) => value.es || value.en, {
    message: "must declare at least one locale",
  });

// A link to evidence outside the repository (a press article, a video, a
// verification page). Milestones require at least one of these — evidence
// over self-reported claims (CLAUDE.md content rules).
export const EXTERNAL_LINK_KINDS = [
  "repo",
  "demo",
  "press",
  "video",
  "credential",
] as const;

export const externalLinkSchema = z.object({
  url: httpsUrlSchema,
  label: localizedStringSchema,
  kind: z.enum(EXTERNAL_LINK_KINDS),
  publisher: z.string().min(1).optional(),
  date: isoDateSchema.optional(),
});
export type ExternalLink = z.infer<typeof externalLinkSchema>;
export type ExternalLinkKind = (typeof EXTERNAL_LINK_KINDS)[number];
