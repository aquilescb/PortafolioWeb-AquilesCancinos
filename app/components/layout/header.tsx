import { Link } from "react-router";
import { localizedPath } from "@content/i18n/route-map";
import { useLocale } from "~/i18n/use-locale";
import { useTranslation } from "~/i18n/use-translation";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const locale = useLocale();
  const t = useTranslation();

  return (
    <header className="border-ink/10 dark:border-ink-dark/15 border-b">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
        <Link
          to={localizedPath("home", locale)}
          className="font-display text-lg font-medium tracking-tight"
        >
          Aquiles Cancinos
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-4">
            <Link to={localizedPath("projects", locale)} className="text-sm">
              {t.nav.projects}
            </Link>
            <Link to={localizedPath("career", locale)} className="text-sm">
              {t.nav.career}
            </Link>
            <Link to={localizedPath("learning", locale)} className="text-sm">
              {t.nav.learning}
            </Link>
            <Link to={localizedPath("about", locale)} className="text-sm">
              {t.nav.about}
            </Link>
          </nav>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
