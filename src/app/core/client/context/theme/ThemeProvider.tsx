import { ReactNode, useState } from "react";
import { Theme, ThemeContext } from "./ThemeContext";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";

export interface Props {
  children: ReactNode;
}

export default function ThemeProvider(props: Props) {
  const [storageTheme, setStorageTheme] = useLocalStorage<Theme>(
    "THEME",
    "dark-theme"
  );
  const [theme, setTheme] = useState<Theme>(storageTheme);

  const changeTheme = (newTheme: Theme) => {
    document.body.setAttribute("data-theme", newTheme)
    setTheme(newTheme);
    setStorageTheme(newTheme);
    
  };

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
