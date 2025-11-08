"use server";

import { getTopicService } from "@/app/core/server/context";

export const searchTopics = async (
  keyword: string,
  limit: number,
  sort?: string,
  offset?: number
) => {
  return getTopicService().search({
    sort: sort,
    limit: limit,
    keyword: keyword,
    offset: offset,
  });
};

export const deleteTopic = async (id: string) => {
  try {
    const res = await getTopicService().remove(id);
    return {
      success: res > 0,
    };
  } catch (error) {
    throw error;
  }
};
