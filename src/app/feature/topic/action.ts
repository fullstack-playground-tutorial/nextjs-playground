"use server";

import { getTopicService } from "@/app/core/server/context";
import { updateTag } from "next/cache";

export const deleteTopic = async (id: string) => {
  try {
    const res = await getTopicService().remove(id);
    if (res > 0) {
      updateTag("topics");
    }
    return res;
  } catch (error) {
    console.log("error when deleted topic #" + id, error);
    throw error;
  }
};
