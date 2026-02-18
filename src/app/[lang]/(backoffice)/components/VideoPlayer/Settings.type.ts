export type SettingsConf = { [key: string]: SettingsTab };

export type SettingsTab<T = void, I=void, H = void> = {
  id: string;
  parentId?: string;
  title?: string;
  valTitle?: string;

  type?: "list" | "select" | "range" | "toggle" | "header-list";
  headerAdditionalButton?: SettingsTab<H>;
  default?: any; // used for default value in list like auto language, quality auto video v.v.. (unimplement)
  value?: any; // used for show value, setState value, id for navigate (switch tab) in settings.
  items?: SettingsTab<I>[];
  isSelected?: boolean;
  targetProperty?: T extends void ? undefined : keyof T; // a value considered as a property of T Generic type, used like a parameter for eventHandle function know which properties will be changed. 
  eventHandle?: (e: any, ...param: any) => void;
  // for range input
  min?: number;
  max?: number;
  step?: number;
};
