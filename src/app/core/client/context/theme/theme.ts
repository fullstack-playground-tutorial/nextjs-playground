const THEME = ["dark-theme", "light-theme", "standard-theme"] as const;


export type Theme = (typeof THEME)[number];

export const isTheme = (t: string) => {
  return THEME.indexOf(t as Theme) != -1;
};