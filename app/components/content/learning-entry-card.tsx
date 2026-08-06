import type { LearningEntry } from "@content";
import { Card } from "~/components/ui/card";
import { ExternalLink } from "~/components/ui/external-link";
import { Tag } from "~/components/ui/tag";
import { useTranslation } from "~/i18n/use-translation";

interface LearningEntryCardProps {
  entry: LearningEntry;
}

// Renders a course or a certification with the same layout — the only
// branch is the certification-only issuedAt/expiresAt/issuer block, since a
// plain course has no such credential lifecycle.
export function LearningEntryCard({ entry }: LearningEntryCardProps) {
  const t = useTranslation();
  const dateRange = entry.endDate
    ? `${entry.startDate} – ${entry.endDate}`
    : entry.startDate;

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-2">
        <Tag>{t.learning.kinds[entry.kind]}</Tag>
        {entry.status === "in-progress" && (
          <Tag>{t.learning.status["in-progress"]}</Tag>
        )}
        <p className="text-ink/60 dark:text-ink-dark/60 ml-auto text-sm">
          {dateRange}
        </p>
      </div>

      <h3 className="font-display mt-3 text-lg font-medium">{entry.name}</h3>
      <p className="text-ink/70 dark:text-ink-dark/70 mt-1 text-sm">
        {entry.provider} · {entry.category}
      </p>

      {entry.kind === "certification" && (
        <dl className="text-ink/70 dark:text-ink-dark/70 mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <div>
            <dt className="text-ink/60 dark:text-ink-dark/60">
              {t.learning.issuedAt}
            </dt>
            <dd>{entry.issuedAt}</dd>
          </div>
          {entry.expiresAt && (
            <div>
              <dt className="text-ink/60 dark:text-ink-dark/60">
                {t.learning.expiresAt}
              </dt>
              <dd>{entry.expiresAt}</dd>
            </div>
          )}
          <div>
            <dt className="text-ink/60 dark:text-ink-dark/60">
              {t.learning.issuer}
            </dt>
            <dd>{entry.issuer}</dd>
          </div>
        </dl>
      )}

      {entry.hours !== undefined && (
        <p className="text-ink/70 dark:text-ink-dark/70 mt-2 text-sm">
          {t.learning.hours}: {entry.hours}
        </p>
      )}

      {entry.verificationUrl && (
        <p className="mt-4">
          <ExternalLink href={entry.verificationUrl} className="text-sm">
            {t.learning.verify}
          </ExternalLink>
        </p>
      )}
    </Card>
  );
}
