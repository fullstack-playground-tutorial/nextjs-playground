"use client";
import { createContext, useCallback, useMemo, useState } from "react";

export type BreadcrumbItem = {
  key?: string | number;
  href?: string; // optional; if missing, render as plain text
  to?: string; // optional; if missing, render as plain text
  label: React.ReactNode;
  title?: string; // optional title attr
  isCurrent?: boolean;
};

type BreadcrumbsContextShape = {
  items: BreadcrumbItem[];
  setItems: (items: BreadcrumbItem[]) => void;
  clear: () => void;
};

export const BreadcrumbsContext = createContext<BreadcrumbsContextShape | null>(
  null
);

export function BreadcrumbProvider({ children }: React.PropsWithChildren<{}>) {
  const [items, setItems] = useState<BreadcrumbItem[]>([]);

  const clear = useCallback(() => setItems([]), [setItems]);

  const value = useMemo(
    () => ({ items, setItems, clear }),
    [items, setItems, clear]
  );

  return (
    <BreadcrumbsContext.Provider value={value}>
      {children}
    </BreadcrumbsContext.Provider>
  );
}
