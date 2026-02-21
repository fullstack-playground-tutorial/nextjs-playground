import { en } from "./en";
import { vi } from "./vi";

const Locales = ["en-US", "vi-VN"] as const;
export type LocaleCode = (typeof Locales)[number];

export interface Dictionary {
  [key: string]: string;
}

export type Dictionaries = Record<LocaleCode, Dictionary>;

const dictionaries: Dictionaries = {
  "en-US": en,
  "vi-VN": vi,
};

export const createLocaleService = (defaultLocale: string = "en-US") => {
  const found = Locales.find(
    (loc) => loc === defaultLocale || loc.startsWith(defaultLocale),
  );

  if (found) {
    defaultLocale = found;
  } else {
    defaultLocale = "en-US";
  }
  let currentLocale: LocaleCode = defaultLocale as LocaleCode;

  const getDictionary = (locale: LocaleCode): Dictionary => {
    return dictionaries[locale] || dictionaries["en-US"];
  };

  // DEPRECATE
  const changeLanguage = (locale: string) => {
    if (!locale) return;
    const found = Locales.find(
      (loc) => loc === locale || loc.startsWith(locale),
    );
    if (found) {
      currentLocale = found;
    }
    // If not found, we keep the previous currentLocale instead of reverting to en-US
    // This handles cases where 'lang' parameter might be a route segment like 'settings'
  };

  const localize = (key: string): string => {
    const dict = getDictionary(currentLocale);
    return dict[key] || key;
  };

  // DEPRECATE
  const getLocale = (acceptLang?: string): LocaleCode => {
    if (!acceptLang) return currentLocale;

    const langs = acceptLang.split(",").map((l) => l.split(";")[0].trim());

    for (const lang of langs) {
      const found = Locales.find((loc) => loc === lang || loc.startsWith(lang));
      if (found) {
        currentLocale = found;
        return found;
      }
    }

    return currentLocale;
  };

  const getSupportLocales = () => Locales;

  return {
    getDictionary,
    changeLanguage,
    localize,
    getLocale,
    get currentLocale() {
      return currentLocale;
    },
    getSupportLocales,
  };
};

let localeService: ReturnType<typeof createLocaleService> | null = null;

export const getLocaleService = (lang?: string) => {
  if (!localeService) {
    localeService = createLocaleService(lang);
  } else if (lang) {
    localeService.changeLanguage(lang);
  }
  return localeService;
};
