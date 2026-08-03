import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { getCaseStudy, getProjectBySlug } from "@content";
import { dictionaries } from "@content/i18n/dictionaries";
import { localeFromPathname } from "@content/i18n/locale";
import { localizedPath, projectDetailPath } from "@content/i18n/route-map";
import { ExternalLink } from "~/components/ui/external-link";
import { Link } from "~/components/ui/link";
import { Prose } from "~/components/ui/prose";
import { Tag } from "~/components/ui/tag";
import { buildAlternates } from "~/seo/alternates";
import { buildMeta } from "~/seo/meta";
import { useLocale } from "~/i18n/use-locale";
import { useTranslation } from "~/i18n/use-translation";

// `app/routes.ts` only registers this route once a real project exists (see
// `hasProjects` in content/index.ts), so react-router-typegen's generated
// `./+types/project-detail` module isn't reliably present. The framework's
// generic loader/meta types keep this file's typechecking independent of
// that registration state, unlike the other routes in this app.
export async function loader({ request, params }: LoaderFunctionArgs) {
  const locale = localeFromPathname(new URL(request.url).pathname);
  const slug = params.slug ?? "";
  const project = getProjectBySlug(slug, locale);
  if (!project) throw new Response("Not Found", { status: 404 });

  const caseStudy = await getCaseStudy(slug, locale);
  return { project, caseStudy };
}

export const meta: MetaFunction<typeof loader> = ({ loaderData, location }) => {
  const locale = localeFromPathname(location.pathname);
  const t = dictionaries[locale];

  if (!loaderData) {
    return [
      { title: t.meta.notFound.title },
      { name: "robots", content: "noindex" },
    ];
  }

  const { project, caseStudy } = loaderData;
  const tags = [
    ...buildMeta({
      locale,
      title: `${project.title} — Aquiles Cancinos`,
      description: project.summary,
    }),
    ...buildAlternates(locale, (altLocale) =>
      projectDetailPath(project.slug, altLocale),
    ),
  ];

  // A case study served via the same-language fallback mixes in the other
  // locale's prose, so it shouldn't be indexed under this URL (plan §6.3).
  if (caseStudy?.isFallback) {
    tags.push({ name: "robots", content: "noindex" });
  }

  return tags;
};

export default function ProjectDetail() {
  const locale = useLocale();
  const t = useTranslation();
  const { project, caseStudy } = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link to={localizedPath("projects", locale)} className="text-sm">
        {t.projects.detail.backToProjects}
      </Link>

      <p className="text-ink/60 dark:text-ink-dark/60 mt-6 text-sm">
        {project.year}
      </p>
      <h1 className="font-display mt-1 text-4xl font-medium tracking-tight">
        {project.title}
      </h1>
      <p className="text-ink/70 dark:text-ink-dark/70 mt-3">
        {project.summary}
      </p>

      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-ink/60 dark:text-ink-dark/60">
            {t.projects.detail.role}
          </dt>
          <dd className="mt-1">{project.role}</dd>
        </div>
        <div>
          <dt className="text-ink/60 dark:text-ink-dark/60">
            {t.projects.filters.context}
          </dt>
          <dd className="mt-1">{t.projects.contexts[project.context]}</dd>
        </div>
        <div>
          <dt className="text-ink/60 dark:text-ink-dark/60">
            {t.projects.detail.statusLabel}
          </dt>
          <dd className="mt-1">{t.projects.detail.status[project.status]}</dd>
        </div>
        {project.duration && (
          <div>
            <dt className="text-ink/60 dark:text-ink-dark/60">
              {t.projects.detail.duration}
            </dt>
            <dd className="mt-1">{project.duration}</dd>
          </div>
        )}
        {project.teamSize !== undefined && (
          <div>
            <dt className="text-ink/60 dark:text-ink-dark/60">
              {t.projects.detail.teamSize}
            </dt>
            <dd className="mt-1">{project.teamSize}</dd>
          </div>
        )}
        {project.organization && (
          <div>
            <dt className="text-ink/60 dark:text-ink-dark/60">
              {t.projects.detail.organization}
            </dt>
            <dd className="mt-1">{project.organization}</dd>
          </div>
        )}
      </dl>

      <div className="mt-8">
        <p className="text-ink/60 dark:text-ink-dark/60 text-sm">
          {t.projects.detail.stack}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {project.technologies.map((technology) => (
            <Tag key={technology.slug}>{technology.name}</Tag>
          ))}
        </div>
      </div>

      {(project.visibility === "private" ||
        project.repositoryUrl ||
        project.demoUrl) && (
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {project.visibility === "private" ? (
            <span className="text-ink/60 dark:text-ink-dark/60">
              {t.projects.privateRepository}
            </span>
          ) : (
            project.repositoryUrl && (
              <ExternalLink href={project.repositoryUrl}>
                {t.projects.detail.repository}
              </ExternalLink>
            )
          )}
          {project.demoUrl && (
            <ExternalLink href={project.demoUrl}>
              {t.projects.detail.demo}
            </ExternalLink>
          )}
        </div>
      )}

      {project.screenshots.length > 0 && (
        <div className="mt-12">
          <h2 className="font-display text-xl font-medium">
            {t.projects.detail.screenshots}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {project.screenshots.map((screenshot) => (
              <img
                key={screenshot}
                src={screenshot}
                alt=""
                loading="lazy"
                className="border-ink/10 dark:border-ink-dark/15 rounded-sm border"
              />
            ))}
          </div>
        </div>
      )}

      {caseStudy && (
        <div className="mt-12">
          {caseStudy.isFallback && (
            <p
              role="status"
              className="border-accent/40 bg-accent/5 text-ink/80 dark:border-accent-dark/40 dark:bg-accent-dark/10 dark:text-ink-dark/80 mb-6 rounded-sm border px-4 py-3 text-sm"
            >
              {t.projects.detail.notTranslated}
            </p>
          )}
          <Prose>
            <caseStudy.Component />
          </Prose>
        </div>
      )}
    </div>
  );
}
