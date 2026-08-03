import { contactSchema, type Contact } from "../schemas/contact";

// No location or availability yet — real values only, per CLAUDE.md content
// rules (§18 of the project plan lists this as priority-high info still
// pending confirmation).
const rawContact = {
  email: "aquilescancinos@gmail.com",
  socials: [
    {
      url: "https://github.com/aquilescb",
      label: { es: "GitHub", en: "GitHub" },
      kind: "profile",
    },
    {
      url: "https://www.linkedin.com/in/aquilescb123/",
      label: { es: "LinkedIn", en: "LinkedIn" },
      kind: "profile",
    },
  ],
};

export const contact: Contact = contactSchema.parse(rawContact);
