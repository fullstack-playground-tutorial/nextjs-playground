import { en } from "./en";
import { vi } from "./vi";

export interface LocaleConfig {
  defaultLocale: Locale;
  locales: string[];
}

export const locales = ["en-US", "vi-VN"] as const;
export type Locale = (typeof locales)[number];

export const localeConfig: LocaleConfig = {
  locales: [...locales],
  defaultLocale: "en-US",
} as const;

interface Dictionary {
  [key: string]: { [key: string]: string }
}

const dictionaries: Dictionary = {
  en: en,
  vi: vi,
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
