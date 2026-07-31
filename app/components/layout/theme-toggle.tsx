import { useSyncExternalStore } from "react";
import { useTranslation } from "~/i18n/use-translation";

type Theme = "light" | "dark";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

// Used while rendering in Node at build time (no DOM available) and for the
// very first client render before hydration reconciles with the real DOM.
// The blocking inline script in root.tsx has already applied the real class
// to <html> by the time a browser paints, so this default never causes a
// visible flash — it only has to match what the pre-rendered HTML assumed.
function getServerSnapshot(): Theme {
  return "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Private browsing or a full storage quota: the toggle still works for
    // this page load, it just won't persist.
  }
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const t = useTranslation();

  function toggle() {
    applyTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={theme === "dark"}
      aria-label={
        theme === "dark" ? t.theme.switchToLight : t.theme.switchToDark
      }
      className="text-ink/70 hover:text-ink dark:text-ink-dark/70 dark:hover:text-ink-dark inline-flex h-9 w-9 items-center justify-center rounded-sm"
    >
      {theme === "dark" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="3.5" />
      <path d="M10 1.5v2M10 16.5v2M18.5 10h-2M3.5 10h-2M15.6 4.4l-1.4 1.4M5.8 14.2l-1.4 1.4M15.6 15.6l-1.4-1.4M5.8 5.8 4.4 4.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17 11.2A7 7 0 0 1 8.8 3a7 7 0 1 0 8.2 8.2Z" />
    </svg>
  );
}
