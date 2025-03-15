"use server";

import { getFriendService } from "@/app/core/server/context";
import { redirect } from "next/navigation";

export async function addFriend(friendId: string) {
  return getFriendService().addFriend(friendId);
}

export async function accept(friendId: string): Promise<number> {
  return getFriendService().accept(friendId);
}

export async function reject(friendId: string): Promise<number> {
  return getFriendService().reject(friendId);
}

// cancel request
export async function cancel(friendId: string): Promise<number> {
  return getFriendService().cancel(friendId);
}

export async function unfriend(friendId: string): Promise<number> {
  return getFriendService().unfriend(friendId);
}
