import { getLocaleService } from "@/app/utils/resource/locales";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const { localize } = getLocaleService(lang);
  return <div>{localize("settings_tab_general")}</div>;
}
