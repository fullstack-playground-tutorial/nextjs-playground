"use server";
import { useNotificationService } from "@/app/core/server/context";
import { Notification } from "./notification";
import { cookies } from "next/headers";

/**
 * Search notifications by userId
 * */
export async function search(): Promise<Notification[]> {
  try {
    const userId = cookies().get("userId")?.value;
    const res = await useNotificationService().Search({
      subscriberId: userId ?? "",
    });
    return res;
  } catch (e: any) {
    throw e;
  }
}
