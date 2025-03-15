"use server";
import { getNotificationService } from "@/app/core/server/context";
import { Notification } from "./notification";
import { cookies } from "next/headers";

/**
 * Search notifications by userId
 * */
export async function search(): Promise<Notification[]> {
  try {
    const userId = cookies().get("userId")?.value;
    const res = await getNotificationService().Search({
      subscriberId: userId ?? "",
    });
    return res;
  } catch (e: any) {
    throw e;
  }
}
