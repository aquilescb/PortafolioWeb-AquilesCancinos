import type { Route } from "./+types/home";
import { dictionaries } from "@content/i18n/dictionaries";
import { localeFromPathname } from "@content/i18n/locale";
import { localizedPath } from "@content/i18n/route-map";
import { buildAlternates } from "~/seo/alternates";
import { buildMeta } from "~/seo/meta";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Link } from "~/components/ui/link";
import { Prose } from "~/components/ui/prose";
import { Tag } from "~/components/ui/tag";
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
    ...buildAlternates("home", locale),
  ];
}

// Design-system preview for Phase 1/2. Real navigation, project content and
// the actual home page copy replace this in Phase 4.
export default function Home() {
  const locale = useLocale();
  const t = useTranslation();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-medium tracking-tight">{t.home.title}</h1>
      <p className="text-ink/70 dark:text-ink-dark/70 mt-3">
        {t.home.subtitle}
      </p>

      <section className="mt-12 space-y-4">
        <h2 className="text-2xl font-medium tracking-tight">
          {t.home.sections.buttons}
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">{t.home.buttons.primary}</Button>
          <Button variant="secondary">{t.home.buttons.secondary}</Button>
        </div>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-2xl font-medium tracking-tight">
          {t.home.sections.tags}
        </h2>
        <div className="flex flex-wrap gap-2">
          <Tag>React</Tag>
          <Tag>TypeScript</Tag>
          <Tag>PostgreSQL</Tag>
        </div>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-2xl font-medium tracking-tight">
          {t.home.sections.card}
        </h2>
        <Card>
          <h3 className="font-display text-xl font-medium">
            {t.home.card.title}
          </h3>
          <p className="text-ink/70 dark:text-ink-dark/70 mt-2 text-sm">
            {t.home.card.body}
          </p>
        </Card>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-2xl font-medium tracking-tight">
          {t.home.sections.prose}
        </h2>
        <Prose>
          <p>
            {t.home.prose.before}{" "}
            <Link to={localizedPath("home", locale)}>{t.home.prose.link}</Link>{" "}
            {t.home.prose.after}
          </p>
        </Prose>
      </section>
    </div>
  );
}
