import type { CareerEntry } from "@content";
import type { Locale } from "@content/i18n/locale";
import { milestoneDetailPath } from "@content/i18n/route-map";
import { Card } from "~/components/ui/card";
import { Link } from "~/components/ui/link";
import { Tag } from "~/components/ui/tag";
import { useTranslation } from "~/i18n/use-translation";

interface TimelineEntryProps {
  entry: CareerEntry;
  locale: Locale;
}

export function TimelineEntry({ entry, locale }: TimelineEntryProps) {
  const t = useTranslation();

  const dateRange = entry.endDate
    ? `${entry.startDate} – ${entry.endDate}`
    : entry.type === "milestone"
      ? entry.startDate
      : `${entry.startDate} – ${t.career.present}`;

  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <Tag>{t.career.types[entry.type]}</Tag>
        <p className="text-ink/60 dark:text-ink-dark/60 text-sm">{dateRange}</p>
      </div>
      <h2 className="font-display mt-3 text-lg font-medium">
        {entry.hasOwnPage ? (
          <Link to={milestoneDetailPath(entry.slug, locale)}>
            {entry.title}
          </Link>
        ) : (
          entry.title
        )}
      </h2>
      {entry.organization && (
        <p className="text-ink/70 dark:text-ink-dark/70 mt-1 text-sm">
          {entry.organization}
        </p>
      )}
      {entry.summary && (
        <p className="text-ink/70 dark:text-ink-dark/70 mt-2 text-sm">
          {entry.summary}
        </p>
      )}
    </Card>
  );
}
