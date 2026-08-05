import { z } from "zod";

import { httpsUrlSchema, localizedStringSchema } from "./shared";

// Just what Phase 4 needs: a link to a personal profile (GitHub, LinkedIn).
// Extend when a real use case needs another kind — the plan's broader
// ExternalLink shape (repo/demo/press/video/credential) belongs to
// Milestones in a later phase, not here.
export const SOCIAL_LINK_KINDS = ["profile"] as const;

export const socialLinkSchema = z.object({
  url: httpsUrlSchema,
  label: localizedStringSchema,
  kind: z.enum(SOCIAL_LINK_KINDS),
});

// A singleton, not a collection: there's exactly one Contact for the whole
// site. `location` and `availability` are real fields from the plan's §8
// model but have no verified value yet, so they're optional rather than
// filled with a placeholder (CLAUDE.md content rules).
export const contactSchema = z.object({
  email: z.string().email(),
  socials: z.array(socialLinkSchema).default([]),
  location: localizedStringSchema.optional(),
  availability: localizedStringSchema.optional(),
});

export type Contact = z.infer<typeof contactSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
