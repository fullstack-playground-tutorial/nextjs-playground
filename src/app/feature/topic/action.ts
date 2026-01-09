"use server";

import { getTopicService } from "@/app/core/server/context";
import { updateTag } from "next/cache";
import { Topic } from "./topic";

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

export const updateTopic = async (id: string, topic: Partial<Topic>) => {
  try {
    await getTopicService().update(id, topic);
    updateTag("topics");
    return { successMsg: topic.status + " successfully" };
  } catch (error) {
    console.log("error when updating topic #" + id, error);
    throw error;
  }
};

export const createTopic = async (topic: Topic) => {
  try {
    await getTopicService().create(topic);
    updateTag("topics");
    return { successMsg: topic.status + " successfully" };
  } catch (error) {
    console.log("error when create topic ", error);
    throw error;
  }
};
