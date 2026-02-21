"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import ProfileIcon from "../../components/Sidebar/icons/profile.svg";
import { getLocaleService } from "@/app/utils/resource/locales";

export default function TabsNav() {
  const pathname = usePathname();
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const { localize } = getLocaleService(lang);

  const tabsData = [
    {
      id: "generals",
      label: localize("settings_tab_general"),
      path: "generals",
      icon: ProfileIcon,
    },
    {
      id: "account",
      label: localize("settings_tab_account"),
      path: "account",
      icon: ProfileIcon,
    },
  ];

  return (
    <div className="flex border-b border-border/50 px-6">
      <nav className="flex gap-8 relative overflow-x-auto no-scrollbar">
        {tabsData.map((tab) => {
          const isActive = pathname.includes(tab.id);
          const Icon = tab.icon;
          const href = `/${lang}/settings/${tab.path}`;

          return (
            <Link
              key={tab.id}
              href={href}
              className={`group relative flex items-center gap-2.5 py-4 text-sm font-semibold transition-all duration-300 ease-out whitespace-nowrap ${
                isActive ? "text-accent-0" : "text-secondary hover:text-primary"
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-all duration-300 [&_path]:transition-colors [&_path]:duration-300 ${
                  isActive
                    ? "scale-110 [&_path]:fill-accent-0"
                    : "[&_path]:fill-secondary group-hover:[&_path]:fill-primary group-hover:scale-105"
                }`}
              />
              <span>{tab.label}</span>

              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-accent-0 transition-transform duration-300 ease-out ${
                  isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                }`}
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
