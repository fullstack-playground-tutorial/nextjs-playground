"use client";
import { createContext } from "react";

export type Theme = "dark-theme" | "light-theme" | "standard-theme";

export interface ThemeContext {
  theme: Theme;
  changeTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContext>({
  theme: "dark-theme",
  changeTheme: () => {
    return;
  },
});
