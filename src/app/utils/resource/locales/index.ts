import { en } from "./en";
import { vi } from "./vi";

export type Locale = "en-US" | "vi-VN";

export interface Dictionary {
  [key: string]: string;
}

export type Dictionaries = {
  [key in Locale]: Dictionary;
};

class LocaleService {
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
}

let localeService = new LocaleService();

export function getLocaleService() {
  if (!localeService) {
    localeService = new LocaleService();
  }
  return localeService;
}
