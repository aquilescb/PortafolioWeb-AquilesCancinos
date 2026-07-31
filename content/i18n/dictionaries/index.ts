import { en } from "./en";
import { es } from "./es";
import type { Locale } from "../locale";

export type Dictionary = typeof es;

export const dictionaries: Record<Locale, Dictionary> = { es, en };
