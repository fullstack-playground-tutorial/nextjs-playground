import { en } from "./en";
import { vi } from "./vi";

const Locales = ["en-US", "vi-VN"] as const;

export type Locale = (typeof Locales)[number];

export interface Dictionary {
  [key: string]: string;
}

export type Dictionaries = Record<Locale, Dictionary>;

class LocaleService {
  locales = Locales;
  dictionaries: Dictionaries = {
    "en-US": en,
    "vi-VN": vi,
  };

  currentLocale: Locale = "en-US";
  constructor() {
    this.getDictionary = this.getDictionary.bind(this);
    this.changeLanguage = this.changeLanguage.bind(this);
  }

  getDictionary(locale: Locale) {
    if (!this.dictionaries) {
      this.dictionaries = {
        "en-US": en,
        "vi-VN": vi,
      };
    }
    return this.dictionaries[locale];
  }

  changeLanguage(locale: Locale) {
    this.currentLocale = locale;
  }

  localize(key: string) {
    return this.getDictionary(this.currentLocale)[key];
  }

  getLocale(acceptLang?: string): Locale {
    if (!acceptLang) return this.currentLocale;

    // "vi,en-US;q=0.9,en;q=0.8"
    const langs = acceptLang.split(",").map((l) => l.split(";")[0].trim());

    // find match correct or match like "vi" -> "vi-VN"
    for (const lang of langs) {
      const found = this.locales.find(
        (loc) => loc === lang || loc.startsWith(lang)
      );
      if (found) {
        this.currentLocale = found;
        return found;
      }
    }

    // fallback
    this.currentLocale = "en-US";
    return "en-US";
  }
}

export const localeService = new LocaleService();
