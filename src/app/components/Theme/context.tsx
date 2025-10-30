"use client"
import { createContext, useEffect, useState } from "react";

const THEME = ["dark", "light"] as const;

type Theme = (typeof THEME)[number];
const isTheme = (t: string) => {
  return THEME.indexOf(t as Theme) != -1;
};

interface ThemeContextShape {
  theme: Theme;
  changeTheme?: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextShape>({
  theme: "dark",
});

interface Props {
  children: React.ReactNode;
}

function ThemeProvider(props: Props) {
  const [theme, setTheme] = useState<Theme>("dark");

  const changeTheme = (newTheme: Theme) => {
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  useEffect(() => {
    const theme = localStorage.getItem("theme") ?? "";
    if (isTheme(theme)) {
      setTheme(theme as Theme);
      document.documentElement.classList.add(theme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      localStorage.setItem("theme", "dark");
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else if (window.matchMedia("(prefers-color-scheme: light)")) {
      localStorage.setItem("theme", "light");
      setTheme("light");
      document.documentElement.classList.add("light");
    }
  }, []);
  return (
    <>
      <ThemeContext
        value={{
          theme: theme,
          changeTheme: changeTheme,
        }}
      >
        {props.children}
      </ThemeContext>
    </>
  );
}

export { ThemeContext, ThemeProvider };
