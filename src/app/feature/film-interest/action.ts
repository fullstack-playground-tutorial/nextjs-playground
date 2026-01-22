"use server"
import { ActionState } from "@/app/[lang]/(backoffice)/(film)/films/interests/components/DeleteForm";
import { UpsertActionState } from "@/app/[lang]/(backoffice)/(film)/films/interests/components/InterestForm";
import { getFilmInterestService } from "@/app/core/server/context";
import { CACHE_TAG } from "@/app/utils/cache/tag";
import { refresh, updateTag } from "next/cache";

export const deleteFilmInterest = async (id: string): Promise<ActionState> => {
  try {
    const res = await getFilmInterestService().remove(id);
    if (res > 0) {
      return {
        successMsg: "successfully deleted tag #" + id,
      };
    } else {
      return {
        successMsg: "not found tag with id #" + id,
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createInterest = async (formData: FormData) => {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const color = formData.get("color") as string;
  try {
    const res = await getFilmInterestService().create({
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

export const editInterest = async (id: string, formData: FormData) => {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const color = formData.get("color") as string;
  const description = formData.get("description") as string;
  try {
    const res = await getFilmInterestService().update(id, {
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

export const upsertInterest = async (
  prevState: UpsertActionState,
  formData: FormData
): Promise<UpsertActionState> => {
  const id = formData.get("id") as string | null;

  try {
    if (id) {
      await editInterest(id, formData);
      updateTag(CACHE_TAG.FILM_INTERESTS);
      return { ...prevState, successMessage: "successfully edited tag #" + id };
    } else {
      await createInterest(formData);
      updateTag(CACHE_TAG.FILM_INTERESTS);
      return { ...prevState, successMessage: "successfully created tag." };
    }
  } catch (error: any) {
    console.log(error);
    return { ...prevState, successMessage: undefined, error: error };
  }
};
