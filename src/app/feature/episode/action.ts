"use server";

import { Episode, ReorderEpisode } from "./episode";
import { getEpisodeService } from "@/app/core/server/context";
import { revalidateTag } from "next/cache";
import { CACHE_TAG } from "@/app/utils/cache/tag";
import { ResponseError } from "@/app/utils/exception/model/response-error";
import { Error422Message } from "@/app/utils/exception/model/response";
import { Schema, ValidateErrors } from "@/app/utils/validate/model";
import { createSchemaItem, InputValidate } from "@/app/utils/validate/validate";

const schema: Schema = {
  title: createSchemaItem("title").isRequired("Title is required"),
  videoUrl: createSchemaItem("videoUrl").isRequired("Video url is required"),
};

export async function createEpisode(filmId: string, episode: Episode) {
  const errs = InputValidate.object(schema).validate<Episode>(episode);

  if (JSON.stringify(errs) !== "{}") {
    return { errMsg: Object.values(errs).join(", ") };
  }

  try {
    const result = await getEpisodeService().create(filmId, episode);
    if (result > 0) {
      revalidateTag(CACHE_TAG.EPISODES + "-" + filmId, "max");
      return { successMsg: "Episode created successfully!" };
    } else {
      return { errMsg: "Episode created failed!" };
    }
  } catch (error) {
    if (error instanceof ResponseError) {
      switch (error.status) {
        case 422:
          const fieldErrs: ValidateErrors = {};
          error.body.forEach((item: Error422Message) => {
            fieldErrs[item.field] = item.message;
          });
          return { fieldErrors: fieldErrs };
        default:
          throw error;
      }
    } else {
      throw error;
    }
  }
}

export async function deleteEpisode(id: string, filmId: string) {
  try {
    const result = await getEpisodeService().delete(id, filmId);
    if (result > 0) {
      revalidateTag(CACHE_TAG.EPISODES + "-" + filmId, "max");
      return { successMsg: "Episode deleted successfully!" };
    } else {
      return { errMsg: "Episode deleted failed!" };
    }
  } catch (error) {
    if (error instanceof ResponseError) {
      switch (error.status) {
        case 422:
          const fieldErrs: ValidateErrors = {};
          error.body.forEach((item: Error422Message) => {
            fieldErrs[item.field] = item.message;
          });
          return { fieldErrors: fieldErrs };
        default:
          throw error;
      }
    } else {
      throw error;
    }
  }
}

export async function updateEpisode(
  id: string,
  filmId: string,
  episode: Episode,
) {
  const errs = InputValidate.object(schema).validate<Episode>(episode, {
    mode: "edit",
  });

  if (JSON.stringify(errs) !== "{}") {
    return { errMsg: Object.values(errs).join(", ") };
  }

  try {
    const result = await getEpisodeService().patch(id, filmId, episode);
    if (result > 0) {
      revalidateTag(CACHE_TAG.EPISODES + "-" + filmId, "max");
      return { successMsg: "Episode updated successfully!" };
    } else {
      return { errMsg: "Episode updated failed!" };
    }
  } catch (error) {
    if (error instanceof ResponseError) {
      switch (error.status) {
        case 422:
          const fieldErrs: ValidateErrors = {};
          error.body.forEach((item: Error422Message) => {
            fieldErrs[item.field] = item.message;
          });
          return { fieldErrors: fieldErrs };
        default:
          throw error;
      }
    } else {
      throw error;
    }
  }
}

export async function reorderEpisode(
  id: string,
  filmId: string,
  episode: ReorderEpisode,
) {
  try {
    const result = await getEpisodeService().reorder(id, filmId, episode);
    if (result > 0) {
      revalidateTag(CACHE_TAG.EPISODES + "-" + filmId, "max");
      return { successMsg: "Episode reordered successfully!" };
    } else {
      return { errMsg: "Episode reordered failed!" };
    }
  } catch (error) {
    if (error instanceof ResponseError) {
      switch (error.status) {
        case 422:
          const fieldErrs: ValidateErrors = {};
          error.body.forEach((item: Error422Message) => {
            fieldErrs[item.field] = item.message;
          });
          return { fieldErrors: fieldErrs };
        default:
          throw error;
      }
    } else {
      throw error;
    }
  }
}
