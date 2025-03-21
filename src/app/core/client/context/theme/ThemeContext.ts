"use client";
import { createContext } from "react";
import { Theme } from "./theme";

export interface ThemeContext {
  theme: Theme;
  changeTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContext>({
  theme: "standard-theme",
  changeTheme: () => {
    return;
  },
});
