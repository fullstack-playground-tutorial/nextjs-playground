import { ReactNode, useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";
import { isTheme, Theme } from "./theme";

export interface Props {
  children: ReactNode;
}

export default function ThemeProvider(props: Props) {
  const [theme, setTheme] = useState<Theme>("standard-theme");

  const changeTheme = (newTheme: Theme) => {
    document.body.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
    localStorage.setItem("THEME", newTheme);
  };
  useEffect(() => {
    const storageTheme = localStorage.getItem("THEME") ?? "";
    if (isTheme(storageTheme)) {
      changeTheme(storageTheme as Theme);
    }
  }, []);
  return (
    <>
      <ThemeContext.Provider
        value={{
          theme: theme,
          changeTheme: changeTheme,
        }}
      >
        {props.children}
      </ThemeContext.Provider>
    </>
  );
}
