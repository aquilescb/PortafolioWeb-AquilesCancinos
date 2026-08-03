import type { Route } from "./+types/about";
import { getContact } from "@content";
import { dictionaries } from "@content/i18n/dictionaries";
import { localeFromPathname } from "@content/i18n/locale";
import { ContactEmail } from "~/components/content/contact-email";
import { ExternalLink } from "~/components/ui/external-link";
import { Prose } from "~/components/ui/prose";
import { buildRouteAlternates } from "~/seo/alternates";
import { buildMeta } from "~/seo/meta";
import { useTranslation } from "~/i18n/use-translation";

export function meta({ location }: Route.MetaArgs) {
  const locale = localeFromPathname(location.pathname);
  const t = dictionaries[locale];

  return [
    ...buildMeta({
      locale,
      title: t.meta.about.title,
      description: t.meta.about.description,
    }),
    ...buildRouteAlternates("about", locale),
  ];
}

export function loader({ request }: Route.LoaderArgs) {
  const locale = localeFromPathname(new URL(request.url).pathname);
  return { contact: getContact(locale) };
}

export default function About({ loaderData }: Route.ComponentProps) {
  const t = useTranslation();
  const { contact } = loaderData;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-accent dark:text-accent-dark font-display text-sm font-medium tracking-wide uppercase">
        {t.about.role}
      </p>
      <h1 className="font-display mt-2 text-4xl font-medium tracking-tight">
        {t.about.heading}
      </h1>
      <p className="text-ink/70 dark:text-ink-dark/70 mt-3">
        {t.about.valueProp}
      </p>

      <Prose className="mt-8">
        <p>{t.about.bio}</p>
      </Prose>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-medium tracking-tight">
          {t.contact.heading}
        </h2>
        <p className="text-ink/70 dark:text-ink-dark/70 mt-2">
          {t.contact.intro}
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <p className="text-ink/60 dark:text-ink-dark/60 text-sm">
              {t.contact.email}
            </p>
            <div className="mt-1">
              <ContactEmail
                user={contact.emailUser}
                domain={contact.emailDomain}
              />
            </div>
          </div>

          {contact.socials.length > 0 && (
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {contact.socials.map((social) => (
                <ExternalLink key={social.url} href={social.url}>
                  {social.label}
                </ExternalLink>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
