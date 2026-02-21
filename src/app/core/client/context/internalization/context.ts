"use client";
import { LocaleCode } from "@/app/utils/resource/locales";
import { createContext } from "react";

/**
 * state interface for internalization context
 */
export interface InternalizationState {
  currentLocale: LocaleCode;
}

export interface InternalizationContext {
  internalization: InternalizationState;
  changeLanguage: (locale: LocaleCode) => void;
  localize: (key: string, ...val: string[]) => string;
}

export const InternalizationContext = createContext<InternalizationContext>({
  internalization: {
    currentLocale: "en-US",
  },
  changeLanguage: (locale: LocaleCode) => {},
  localize: (key: string, ...val: string[]) => "",
});
