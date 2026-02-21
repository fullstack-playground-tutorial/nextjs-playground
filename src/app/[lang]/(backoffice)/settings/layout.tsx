import SettingsIcon from "../components/Sidebar/icons/settings.svg";
import TabsNav from "./components/TabsNav";
import { getLocaleService } from "@/app/utils/resource/locales";

export default async function Layout({
  tabs,
  params,
}: {
  tabs: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const { localize } = getLocaleService(lang);

  return (
    <div className="flex h-full w-full flex-col p-6 lg:p-10 bg-surface-2/30 dark:bg-surface-0/10">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-0 shadow-lg shadow-accent-0/20 text-white transition-transform hover:scale-105">
              <SettingsIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight dark:text-primary">
                {localize("settings_layout_title")}
              </h1>
              <p className="text-sm text-secondary font-medium">
                {localize("settings_layout_description")}
              </p>
            </div>
          </div>
        </div>

        {/* Main Interface Content */}
        <div className="flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-surface-0 shadow-xl shadow-black/[0.03] dark:bg-surface-1 dark:shadow-none transition-all duration-500">
          <TabsNav />

          <div className="flex-1 overflow-y-auto min-h-[500px]">
            <div className="h-full animate-in fade-in duration-500 p-6 lg:p-10">
              {tabs}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
