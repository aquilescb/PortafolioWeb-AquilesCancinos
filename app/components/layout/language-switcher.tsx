import { Link, useLocation } from "react-router";
import { LOCALES } from "@content/i18n/locale";
import { equivalentPath } from "@content/i18n/route-map";
import { useLocale } from "~/i18n/use-locale";
import { useTranslation } from "~/i18n/use-translation";

// Switches to the equivalent URL of the current page in the other locale
// (not always home), so the visitor keeps their place when they translate.
export function LanguageSwitcher() {
  const { pathname } = useLocation();
  const locale = useLocale();
  const t = useTranslation();

  return (
    <nav
      aria-label={t.language.label}
      className="flex items-center gap-2 text-sm"
    >
      {LOCALES.map((target) => (
        <Link
          key={target}
          to={equivalentPath(pathname, target)}
          aria-current={target === locale ? "page" : undefined}
          className={
            target === locale
              ? "text-ink dark:text-ink-dark font-medium"
              : "text-ink/60 hover:text-ink dark:text-ink-dark/60 dark:hover:text-ink-dark"
          }
        >
          {t.language.names[target]}
        </Link>
      ))}
    </nav>
  );
}
