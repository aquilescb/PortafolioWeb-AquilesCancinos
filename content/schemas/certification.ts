import { z } from "zod";

import { courseObjectSchema } from "./course";
import { isoDateSchema } from "./shared";

const certificationObjectSchema = courseObjectSchema.extend({
  issuedAt: isoDateSchema,
  expiresAt: isoDateSchema.optional(),
  issuer: z.string().min(1),
  badgeUrl: z.string().min(1).optional(),
});

export const certificationSchema = certificationObjectSchema
  .refine(
    (certification) =>
      !certification.endDate ||
      certification.endDate >= certification.startDate,
    {
      message: "endDate must not precede startDate",
      path: ["endDate"],
    },
  )
  .refine(
    (certification) =>
      !certification.expiresAt ||
      certification.expiresAt >= certification.issuedAt,
    { message: "expiresAt must not precede issuedAt", path: ["expiresAt"] },
  );

export type Certification = z.infer<typeof certificationSchema>;
