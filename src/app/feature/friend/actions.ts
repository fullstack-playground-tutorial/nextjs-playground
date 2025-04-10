"use server";

import appContext from "@/app/core/server/context";

export async function addFriend(friendId: string) {
  return appContext.getFriendService().addFriend(friendId);
}

export async function accept(friendId: string): Promise<number> {
  return appContext.getFriendService().accept(friendId);
}

export async function reject(friendId: string): Promise<number> {
  return appContext.getFriendService().reject(friendId);
}

// cancel request
export async function cancel(friendId: string): Promise<number> {
  return appContext.getFriendService().cancel(friendId);
}

export async function unfriend(friendId: string): Promise<number> {
  return appContext.getFriendService().unfriend(friendId);
}
