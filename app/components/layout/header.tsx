import { Link } from "react-router";
import { ThemeToggle } from "./theme-toggle";

// Navigation links, the language switcher and localized paths arrive in
// Phase 2 once routes are bilingual. For now the header only establishes the
// document landmarks and the theme control.
export function Header() {
  return (
    <header className="border-ink/10 dark:border-ink-dark/15 border-b">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="font-display text-lg font-medium tracking-tight"
        >
          Aquiles Cancinos
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
