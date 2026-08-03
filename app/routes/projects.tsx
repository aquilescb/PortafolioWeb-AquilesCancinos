import type { Route } from "./+types/projects";
import { getAllProjects } from "@content";
import { dictionaries } from "@content/i18n/dictionaries";
import { localeFromPathname } from "@content/i18n/locale";
import { ProjectCard } from "~/components/content/project-card";
import { ProjectFilters } from "~/components/content/project-filters";
import { buildAlternates } from "~/seo/alternates";
import { buildMeta } from "~/seo/meta";
import { useLocale } from "~/i18n/use-locale";
import { useTranslation } from "~/i18n/use-translation";
import { filterProjects, parseProjectFilter } from "~/lib/project-filters";
import { useSearchParams } from "react-router";

export function meta({ location }: Route.MetaArgs) {
  const locale = localeFromPathname(location.pathname);
  const t = dictionaries[locale];

  return [
    ...buildMeta({
      locale,
      title: t.meta.projects.title,
      description: t.meta.projects.description,
    }),
    ...buildAlternates("projects", locale),
  ];
}

export function loader({ request }: Route.LoaderArgs) {
  const locale = localeFromPathname(new URL(request.url).pathname);
  return { projects: getAllProjects(locale) };
}

// The loader's project list doesn't depend on the URL's filter params —
// those are applied client-side (see `~/lib/project-filters`) — so a filter
// change would otherwise trigger a pointless refetch of the same payload.
export function shouldRevalidate() {
  return false;
}

export default function Projects({ loaderData }: Route.ComponentProps) {
  const locale = useLocale();
  const t = useTranslation();
  const [searchParams] = useSearchParams();

  const filter = parseProjectFilter(searchParams);
  const visible = filterProjects(loaderData.projects, filter);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-medium tracking-tight">
        {t.projects.heading}
      </h1>
      <p className="text-ink/70 dark:text-ink-dark/70 mt-3">
        {t.projects.intro}
      </p>

      <ProjectFilters projects={loaderData.projects} locale={locale} />

      {visible.length === 0 ? (
        <p className="text-ink/60 dark:text-ink-dark/60 mt-12">
          {t.projects.empty}
        </p>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {visible.map((project) => (
            <ProjectCard key={project.slug} project={project} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
