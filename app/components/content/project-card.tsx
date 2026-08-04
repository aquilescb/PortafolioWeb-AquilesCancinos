import type { ProjectSummary } from "@content";
import type { Locale } from "@content/i18n/locale";
import { projectDetailPath } from "@content/i18n/route-map";
import { Card } from "~/components/ui/card";
import { Link } from "~/components/ui/link";
import { Tag } from "~/components/ui/tag";

interface ProjectCardProps {
  project: ProjectSummary;
  locale: Locale;
  // Cards render directly under the page's `h1` on the projects list (h2 is
  // correct there), but the home page nests them under its own "Featured
  // projects" `h2` section heading — this lets the caller keep heading order
  // correct instead of the component guessing its context.
  headingLevel?: 2 | 3;
}

// A fixed aspect-ratio wrapper keeps layout stable before the image loads,
// even without known intrinsic dimensions (the cover has none yet — Phase 4
// ships without real screenshots). `ResponsiveImage` replaces this `<img>`
// once real, dimensioned assets exist.
export function ProjectCard({
  project,
  locale,
  headingLevel = 2,
}: ProjectCardProps) {
  const href = projectDetailPath(project.slug, locale);
  const Heading = headingLevel === 3 ? "h3" : "h2";

  return (
    <article>
      <Card className="p-0">
        <div className="border-ink/10 dark:border-ink-dark/15 aspect-[3/2] overflow-hidden border-b">
          <img
            src={project.cover}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-6">
          <p className="text-ink/60 dark:text-ink-dark/60 text-sm">
            {project.year}
          </p>
          <Heading className="font-display mt-1 text-xl font-medium">
            <Link to={href}>{project.title}</Link>
          </Heading>
          <p className="text-ink/70 dark:text-ink-dark/70 mt-2 text-sm">
            {project.summary}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <Tag key={technology.slug}>{technology.name}</Tag>
            ))}
          </div>
        </div>
      </Card>
    </article>
  );
}
