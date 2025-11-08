"use client";
import { User, UserInfo } from "@/app/feature/auth";
import Sidebar from "./Sidebar/Sidebar";
import { useState } from "react";

export const Body = ({
  userInfo,
  children,
  logoutAction,
}: {
  userInfo: UserInfo;
  children: React.ReactNode;
  logoutAction: () => Promise<number>;
}) => {
  const [topbar, setTopbar] = useState(false);
  return (
    <div
      className={`w-full flex ${
        topbar ? "flex-col" : "flex-row"
      } justify-between gap-1 h-screen`}
    >
      <Sidebar
        userInfo={userInfo}
        topbar={topbar}
        onToggleViewbar={() => setTopbar(!topbar)}
      />
      <div className="flex-1 p-1 overflow-y-auto">{children}</div>
    </div>
  );
};
