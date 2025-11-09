"use server";

import { getTopicTagService } from "@/app/core/server/context";
import { Tag, TagFilter } from "./topic-tags";

export const searchTags = async (
  filter: TagFilter
) => {
  return getTopicTagService().search(filter);
};

export const deleteTag = async (id: string) => {
    return getTopicTagService().remove(id)
}

export const addTags = async (title: string, slug: string) => {
    return getTopicTagService().create({title: title, slug: slug})
}

export const loadTag = async (id: string) => {
    return getTopicTagService().load(id)
}