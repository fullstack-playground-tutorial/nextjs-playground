import React from "react";
import { getNotificationService } from "@/app/core/server/context";
import { cookies } from "next/headers";
import NotificationDrawer from "@/app/feature/notification/components/NotificationDrawer";

export default async function NotificationIntercept() {
  const cookieList = await cookies();
  const userId = cookieList.get("userId")?.value;
  const notifications = await getNotificationService().Search({
    subscriberId: userId ?? "",
  });

  return (
    <NotificationDrawer initialNotifications={notifications} />
  );
}
