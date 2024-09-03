"use client"
import { Locale } from "@/app/utils/resource/locales";
import { createContext } from "react";

/**
 * state interface for internalization context
 */
export interface InternalizationState {
    currentLocale: Locale;
  }
  
  export interface InternalizationContext {
    internalization: InternalizationState;
    changeLanguage: (locale: Locale) => void;
    localize: (key: string, ...val: string[]) => string;
  }
  
  export const InternalizationContext = createContext<
    InternalizationContext | undefined
  >({internalization: {
    currentLocale: 'en-US',
  },
    changeLanguage: (locale: Locale) => {},
    localize: (key: string, ...val: string[]) => ""
});