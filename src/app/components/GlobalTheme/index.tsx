"use client";
import {
  Theme,
  ThemeContext,
} from "@/app/core/client/context/theme/ThemeContext";
import { use, useEffect } from "react";

export default function GlobalTheme({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = use(ThemeContext);
useEffect(()=> {
    ctx.changeTheme("dark-theme")
},[])
  return <div className={`h-screen`}>{children}</div>;
}
