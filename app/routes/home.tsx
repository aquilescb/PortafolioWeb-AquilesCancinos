import type { Route } from "./+types/home";
import { getContact, getFeaturedProjects } from "@content";
import { dictionaries } from "@content/i18n/dictionaries";
import { localeFromPathname } from "@content/i18n/locale";
import { localizedPath } from "@content/i18n/route-map";
import { ProjectCard } from "~/components/content/project-card";
import { buttonClassName } from "~/components/ui/button";
import { ExternalLink } from "~/components/ui/external-link";
import { Link } from "~/components/ui/link";
import { Tag } from "~/components/ui/tag";
import { buildRouteAlternates } from "~/seo/alternates";
import { buildMeta } from "~/seo/meta";
import { useLocale } from "~/i18n/use-locale";
import { useTranslation } from "~/i18n/use-translation";

export function meta({ location }: Route.MetaArgs) {
  const locale = localeFromPathname(location.pathname);
  const t = dictionaries[locale];

  return [
    ...buildMeta({
      locale,
      title: t.meta.home.title,
      description: t.meta.home.description,
    }),
    ...buildRouteAlternates("home", locale),
  ];
}

export function loader({ request }: Route.LoaderArgs) {
  const locale = localeFromPathname(new URL(request.url).pathname);
  return {
    featured: getFeaturedProjects(locale),
    contact: getContact(locale),
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const locale = useLocale();
  const t = useTranslation();
  const { featured, contact } = loaderData;

  // Evidence is derived from the featured projects actually shown above, not
  // a separate claim — same real, verifiable technologies (plan §17: the
  // home's "evidence" section can't reference Milestones yet, so it's stack
  // + verifiable links instead).
  const technologies = new Map<string, string>();
  for (const project of featured) {
    for (const technology of project.technologies) {
      technologies.set(technology.slug, technology.name);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-accent dark:text-accent-dark font-display text-sm font-medium tracking-wide uppercase">
        {t.about.role}
      </p>
      <h1 className="font-display mt-2 text-4xl font-medium tracking-tight">
        {t.home.heading}
      </h1>
      <p className="text-ink/70 dark:text-ink-dark/70 mt-3 max-w-prose">
        {t.about.valueProp}
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to={localizedPath("projects", locale)}
          className={buttonClassName("primary")}
        >
          {t.home.cta.projects}
        </Link>
        <Link
          to={localizedPath("about", locale)}
          className={buttonClassName("secondary")}
        >
          {t.home.cta.about}
        </Link>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-medium tracking-tight">
          {t.home.featured.heading}
        </h2>

        {featured.length === 0 ? (
          <p className="text-ink/60 dark:text-ink-dark/60 mt-4">
            {t.home.featured.empty}
          </p>
        ) : (
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            {featured.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                locale={locale}
                headingLevel={3}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-medium tracking-tight">
          {t.home.evidence.heading}
        </h2>
        <p className="text-ink/70 dark:text-ink-dark/70 mt-2">
          {t.home.evidence.intro}
        </p>

        {technologies.size === 0 ? (
          <p className="text-ink/60 dark:text-ink-dark/60 mt-4">
            {t.home.evidence.empty}
          </p>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            {[...technologies].map(([slug, name]) => (
              <Tag key={slug}>{name}</Tag>
            ))}
          </div>
        )}

        {contact.socials.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {contact.socials.map((social) => (
              <ExternalLink key={social.url} href={social.url}>
                {social.label}
              </ExternalLink>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
