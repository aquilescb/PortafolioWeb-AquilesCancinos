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
// phases introduce new referenceable entities (skill, course, milestone...).
export const ENTITY_TYPES = ["technology"] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

// A typed pointer to another entity. The content validator resolves every
// `EntityRef` against the real entity list so relations can never dangle.
export const entityRefSchema = z.object({
  type: z.enum(ENTITY_TYPES),
  slug: slugSchema,
});
export type EntityRef = z.infer<typeof entityRefSchema>;
