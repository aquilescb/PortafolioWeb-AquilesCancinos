import { useLocation } from "react-router";
import { localeFromPathname } from "@content/i18n/locale";

export function useLocale() {
  const { pathname } = useLocation();
  return localeFromPathname(pathname);
}
