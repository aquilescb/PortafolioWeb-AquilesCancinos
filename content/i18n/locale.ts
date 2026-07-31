export type Locale = "es" | "en";

export const LOCALES: readonly Locale[] = ["es", "en"];

export const DEFAULT_LOCALE: Locale = "es";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

// Every prerendered document lives under `/es/...` or `/en/...`, so the
// locale is always the first path segment. Falls back to the default locale
// for `/` (the redirect stub) and any unrecognised segment.
export function localeFromPathname(pathname: string): Locale {
  const segment = pathname.split("/")[1];
  return segment && isLocale(segment) ? segment : DEFAULT_LOCALE;
}
