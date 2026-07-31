import type { Route } from "./+types/not-found";
import { dictionaries } from "@content/i18n/dictionaries";
import { localeFromPathname } from "@content/i18n/locale";
import { localizedPath } from "@content/i18n/route-map";
import { Link } from "~/components/ui/link";
import { useLocale } from "~/i18n/use-locale";
import { useTranslation } from "~/i18n/use-translation";

export function meta({ location }: Route.MetaArgs) {
  const locale = localeFromPathname(location.pathname);
  const t = dictionaries[locale];

  return [
    { title: t.meta.notFound.title },
    { name: "robots", content: "noindex" },
  ];
}

export default function NotFound() {
  const locale = useLocale();
  const t = useTranslation();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-accent dark:text-accent-dark font-display text-sm font-medium tracking-wide uppercase">
        {t.notFound.eyebrow}
      </p>
      <h1 className="mt-2 text-4xl font-medium tracking-tight">
        {t.notFound.heading}
      </h1>
      <p className="text-ink/70 dark:text-ink-dark/70 mt-3">
        {t.notFound.description}
      </p>
      <Link to={localizedPath("home", locale)} className="mt-8 inline-block">
        {t.notFound.backHome}
      </Link>
    </div>
  );
}
