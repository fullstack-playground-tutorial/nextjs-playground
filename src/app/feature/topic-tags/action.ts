"use server";

import { getTopicTagService } from "@/app/core/server/context";
import { TagFilter } from "./topic-tags";
import { refresh, revalidateTag } from "next/cache";
import { UpsertActionState } from "@/app/[lang]/(backoffice)/topics/tags/components/TagForm";
import { ActionState } from "@/app/[lang]/(backoffice)/topics/tags/components/DeleteForm";

export const searchTags = async (filter: TagFilter) => {
  return getTopicTagService().search(filter);
};

export const deleteTag = async (id: string): Promise<ActionState> => {
  try {
    const res = await getTopicTagService().remove(id);
    if (res > 0) {
      return {
        successMsg: "successfully deleted tag #" + id,
        error: undefined,
      };
    } else {
      return {
        successMsg: "not found tag with id #" + id,
        error: undefined,
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addTag = async (formData: FormData) => {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const color = formData.get("color") as string;
  try {
    const res = await getTopicTagService().create({
      title,
      slug,
      color,
      description,
    });
    if (res > 0) {
      refresh();
    }
  } catch (error) {
    throw error;
  }
};

export const editTag = async (id: string, formData: FormData) => {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const color = formData.get("color") as string;
  const description = formData.get("description") as string;
  try {
    const res = await getTopicTagService().update(id, {
      title: title,
      slug: slug,
      color: color,
      description: description,
    });
    return res;
  } catch (error) {
    throw error;
  }
};

export const upsertTag = async (
  prevState: UpsertActionState,
  formData: FormData
): Promise<UpsertActionState> => {
  const id = formData.get("id") as string | null;

  try {
    if (id) {
      await editTag(id, formData);
      revalidateTag("topics_tag", "max");
      return { ...prevState, successMessage: "successfully edited tag #" + id };
    } else {
      await addTag(formData);
      revalidateTag("topics_tag", "max");
      return { ...prevState, successMessage: "successfully created tag." };
    }
  } catch (error: any) {
    console.log(error);
    return { ...prevState, successMessage: undefined, error: error };
  }
};
