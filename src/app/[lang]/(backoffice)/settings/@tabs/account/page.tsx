import AccountForm from "./AccountForm";
import Link from "next/link";
import { getLocaleService } from "@/app/utils/resource/locales";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const { getSupportLocales, localize } = getLocaleService(lang);

  const locales = getSupportLocales();
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <AccountForm />

      {/* Preferences Section - Server Side Language Switcher */}
      <section className="space-y-4 pt-4 border-t border-border dark:border-border">
        <h3 className="text-lg font-semibold dark:text-primary">
          {localize("settings_account_preferences")}
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary">
              {localize("settings_account_language")}
            </label>
            <div className="flex gap-2">
              {locales.map((i) => {
                return (
                  <Link
                    key={i}
                    href={`/${i}/settings/account`}
                    scroll={true}
                    className={`flex-1 flex items-center justify-center rounded-xl border py-3 text-sm font-semibold transition-all duration-300 ${
                      lang === i
                        ? "bg-accent-0 border-accent-0 text-white shadow-lg shadow-accent-0/20"
                        : "border-border hover:bg-surface-2 text-secondary"
                    }`}
                  >
                    {localize(i)}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-4 pt-8">
        <div className="rounded-lg border border-alert-0/30 bg-alert-0/5 p-6 dark:bg-alert-0/10">
          <h3 className="text-lg font-semibold text-alert-0">
            {localize("settings_account_danger_zone")}
          </h3>
          <p className="mt-1 text-sm text-secondary dark:text-secondary">
            {localize("settings_account_delete_desc")}
          </p>
          <div className="mt-4">
            <button className="btn btn-md bg-alert-0 text-white hover:bg-alert-1 transition-colors">
              {localize("settings_account_delete_btn")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
