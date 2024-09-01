"use server";

import { useFriendService } from "@/app/core/server/context";


export async function addFriend(friendId: string): Promise<number> {
  return useFriendService().addFriend(friendId);
}

export async function accept(friendId: string): Promise<number> {
    return useFriendService().accept(friendId)
}

export async function reject(friendId: string): Promise<number> {
  return useFriendService().reject(friendId)
}

// cancel request
export async function cancel(friendId: string): Promise<number> {
  return useFriendService().cancel(friendId)
}

export async function unfriend(friendId: string): Promise<number> {
  return useFriendService().unfriend(friendId)
}