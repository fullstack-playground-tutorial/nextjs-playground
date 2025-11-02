import { en } from "./en";
import { vi } from "./vi";

const Locales = ["en-US", "vi-VN"] as const;
export type Locale = (typeof Locales)[number];

export interface Dictionary {
  [key: string]: string;
}

export type Dictionaries = Record<Locale, Dictionary>;

const dictionaries: Dictionaries = {
  "en-US": en,
  "vi-VN": vi,
};

export const createLocaleService = (defaultLocale: Locale = "en-US") => {
  let currentLocale: Locale = defaultLocale;

  const getDictionary = (locale: Locale): Dictionary => {
    return dictionaries[locale] || dictionaries["en-US"];
  };

  const changeLanguage = (locale: Locale) => {
    if (Locales.includes(locale)) {
      currentLocale = locale;
    } else {
      currentLocale = "en-US";
    }
  };

  const localize = (key: string): string => {
    const dict = getDictionary(currentLocale);
    return dict[key] || key;
  };

  const getLocale = (acceptLang?: string): Locale => {
    if (!acceptLang) return currentLocale;

    const langs = acceptLang.split(",").map((l) => l.split(";")[0].trim());

    for (const lang of langs) {
      const found = Locales.find((loc) => loc === lang || loc.startsWith(lang));
      if (found) {
        currentLocale = found;
        return found;
      }
    }

    currentLocale = "en-US";
    return "en-US";
  };

  const getSupportLocales = () => Locales;

  return {
    getDictionary,
    changeLanguage,
    localize,
    getLocale,
    currentLocale,
    getSupportLocales,
  };
};

// Khởi tạo instance dùng chung
export const localeService = createLocaleService();
