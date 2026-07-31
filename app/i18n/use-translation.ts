import { dictionaries } from "@content/i18n/dictionaries";
import { useLocale } from "./use-locale";

export function useTranslation() {
  return dictionaries[useLocale()];
}
