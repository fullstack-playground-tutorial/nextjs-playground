"use client";
import { AuthUser } from "@/app/feature/auth";
import Sidebar from "./Sidebar/Sidebar";
import { useState } from "react";

export const Body = ({
  user,
  children,
  logoutAction
}: {
  user: AuthUser;
  children: React.ReactNode;
  logoutAction: () => Promise<number>;
}) => {
  const [topbar, setTopbar] = useState(false);
  return (
    <div className={`w-full flex ${topbar ? "flex-col": "flex-row"} justify-between gap-1 h-screen`}>
      <Sidebar user={user} topbar={topbar} onToggleViewbar={() => setTopbar(!topbar)}/>
      {children}
    </div>
  );
};
