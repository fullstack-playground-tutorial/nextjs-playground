import React from "react";
import NotificationList from "@/app/feature/notification/components/NotificationList";
import { getNotificationService } from "@/app/core/server/context";
import { cookies } from "next/headers";

export default async function NotificationsPage() {
  const cookieList = await cookies();
  const userId = cookieList.get("userId")?.value;
  const notifications = await getNotificationService().Search({
    subscriberId: userId ?? "",
  });

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">
            Thông báo của bạn
          </h1>
          <div className="h-1 w-20 bg-accent-0 rounded-full"></div>
        </header>

        <section className="bg-surface-1/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
            <h3 className="text-lg font-bold text-white/80">
              Gần đây
            </h3>
            <button className="px-4 py-2 rounded-full bg-accent-0/10 hover:bg-accent-0/20 text-accent-0 text-xs font-bold transition-all">
              Đánh dấu tất cả là đã đọc
            </button>
          </div>
          
          <NotificationList initialNotifications={notifications} />
        </section>
      </div>
    </main>
  );
}
