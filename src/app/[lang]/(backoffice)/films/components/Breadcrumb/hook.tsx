import { useContext } from "react";
import { BreadcrumbsContext } from "./context";

export default function useBreadcrumb() {
  const ctx = useContext(BreadcrumbsContext);
  if (!ctx) {
    throw new Error("useBreadcrumbs must be used inside a BreadcrumbsProvider");
  }
  return ctx;
}
