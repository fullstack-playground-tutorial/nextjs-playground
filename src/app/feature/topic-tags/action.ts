"use server";

import { getTopicTagService } from "@/app/core/server/context";
import { TagFilter } from "./topic-tags";

export const searchTags = async (filter: TagFilter) => {
  return getTopicTagService().search(filter);
};

export const deleteTag = async (id: string, formData: FormData) => {
  try {
    await getTopicTagService().remove(id);
  } catch (error) {
    throw error;
  }
};

export const addTag = async (formData: FormData) => {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const color = formData.get("color") as string;
  try {
    const res = await getTopicTagService().create({
      title: title,
      slug: slug,
      color: color,
    });
    if (res > 0) {
      alert("tag added successfully");
    }
  } catch (error) {
    throw error;
  }
};

export const loadTag = async (id: string) => {
  try {
    if (id.trim().length > 0){
      const res = await getTopicTagService().load(id);
      return res;
    }
    return undefined;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const editTag = async (id: string, formData: FormData) => {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const color = formData.get("color") as string;
  try {
    const res = await getTopicTagService().update(id, {
      title: title,
      slug: slug,
      color: color,
    });
    if (res > 0) {
      alert("tag update successfully");
    }
  } catch (error) {
    throw error;
  }
};
