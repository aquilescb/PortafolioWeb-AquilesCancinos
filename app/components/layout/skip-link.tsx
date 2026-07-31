import { useTranslation } from "~/i18n/use-translation";

export function SkipLink() {
  const t = useTranslation();

  return (
    <a
      href="#main-content"
      className="focus:bg-ink focus:text-paper dark:focus:bg-ink-dark dark:focus:text-paper-dark sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-sm focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
    >
      {t.nav.skipToContent}
    </a>
  );
}
