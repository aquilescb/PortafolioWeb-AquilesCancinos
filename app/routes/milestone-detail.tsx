import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { getMilestoneBody, getMilestoneBySlug } from "@content";
import { dictionaries } from "@content/i18n/dictionaries";
import { localeFromPathname } from "@content/i18n/locale";
import { localizedPath, milestoneDetailPath } from "@content/i18n/route-map";
import { YouTubeFacade } from "~/components/content/youtube-facade";
import { ExternalLink } from "~/components/ui/external-link";
import { Link } from "~/components/ui/link";
import { Prose } from "~/components/ui/prose";
import { Tag } from "~/components/ui/tag";
import { buildAlternates } from "~/seo/alternates";
import {
  globalMetaTags,
  milestoneBreadcrumbJsonLd,
  milestoneJsonLd,
} from "~/seo/json-ld";
import { buildMeta } from "~/seo/meta";
import { useLocale } from "~/i18n/use-locale";
import { useTranslation } from "~/i18n/use-translation";

// `app/routes.ts` only registers this route once a real milestone declares
// `hasOwnPage: true` (see `hasMilestonePages` in content/index.ts), so
// react-router-typegen's generated `./+types/milestone-detail` module isn't
// reliably present. The framework's generic loader/meta types keep this
// file's typechecking independent of that registration state, same as
// `project-detail.tsx`.
export async function loader({ request, params }: LoaderFunctionArgs) {
  const locale = localeFromPathname(new URL(request.url).pathname);
  const slug = params.slug ?? "";
  const milestone = getMilestoneBySlug(slug, locale);
  if (!milestone) throw new Response("Not Found", { status: 404 });

  const body = await getMilestoneBody(slug, locale);
  return { milestone, body };
}

export const meta: MetaFunction<typeof loader> = ({
  loaderData,
  location,
  matches,
}) => {
  const locale = localeFromPathname(location.pathname);
  const t = dictionaries[locale];

  if (!loaderData) {
    return [
      { title: t.meta.notFound.title },
      { name: "robots", content: "noindex" },
    ];
  }

  const { milestone, body } = loaderData;
  const tags = [
    ...globalMetaTags(matches),
    ...buildMeta({
      locale,
      title: `${milestone.title} — Aquiles Cancinos`,
      description: milestone.summary,
    }),
    ...buildAlternates(locale, (altLocale) =>
      milestoneDetailPath(milestone.slug, altLocale),
    ),
  ];

  // A body served via the same-language fallback mixes in the other
  // locale's prose, so it shouldn't be indexed under this URL (plan §6.3).
  if (body?.isFallback) {
    tags.push({ name: "robots", content: "noindex" });
  }

  tags.push(
    { "script:ld+json": milestoneJsonLd(milestone, locale) },
    { "script:ld+json": milestoneBreadcrumbJsonLd(milestone, locale) },
  );

  return tags;
};

export default function MilestoneDetail() {
  const locale = useLocale();
  const t = useTranslation();
  const { milestone, body } = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link to={localizedPath("career", locale)} className="text-sm">
        {t.milestone.detail.backToCareer}
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <Tag>{t.career.milestoneTypes[milestone.type]}</Tag>
        <p className="text-ink/60 dark:text-ink-dark/60 text-sm">
          {milestone.date}
        </p>
      </div>
      <h1 className="font-display mt-3 text-4xl font-medium tracking-tight">
        {milestone.title}
      </h1>
      <p className="text-ink/70 dark:text-ink-dark/70 mt-3">
        {milestone.summary}
      </p>

      {milestone.organization && (
        <p className="text-ink/60 dark:text-ink-dark/60 mt-4 text-sm">
          {t.milestone.detail.organization}: {milestone.organization}
        </p>
      )}

      {milestone.videoId && (
        <div className="mt-8">
          <YouTubeFacade videoId={milestone.videoId} title={milestone.title} />
        </div>
      )}

      <div className="mt-8">
        <h2 className="font-display text-xl font-medium">
          {t.milestone.detail.evidence}
        </h2>
        <ul className="mt-4 space-y-2 text-sm">
          {milestone.evidence.map((link) => (
            <li key={link.url}>
              <ExternalLink href={link.url}>{link.label}</ExternalLink>
            </li>
          ))}
        </ul>
      </div>

      {milestone.relatedProjects.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-xl font-medium">
            {t.milestone.detail.relatedProjects}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {milestone.relatedProjects.map((project) => (
              <Link
                key={project.slug}
                to={`${localizedPath("projects", locale)}/${project.slug}`}
              >
                {project.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {body && (
        <div className="mt-12">
          {body.isFallback && (
            <p
              role="status"
              className="border-accent/40 bg-accent/5 text-ink/80 dark:border-accent-dark/40 dark:bg-accent-dark/10 dark:text-ink-dark/80 mb-6 rounded-sm border px-4 py-3 text-sm"
            >
              {t.milestone.detail.notTranslated}
            </p>
          )}
          <Prose>
            <body.Component />
          </Prose>
        </div>
      )}
    </div>
  );
}
