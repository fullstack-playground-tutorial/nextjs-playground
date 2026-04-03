"use server"

import { Episode } from "./episode";
import { getEpisodeService } from "@/app/core/server/context";
import { revalidateTag } from "next/cache";
import { CACHE_TAG } from "@/app/utils/cache/tag";
import { ResponseError } from "@/app/utils/exception/model/response-error";
import { Error422Message } from "@/app/utils/exception/model/response";
import { ValidateErrors } from "@/app/utils/validate/model";

export async function createEpisode(filmId: string, episode: Episode) {
    try {
        const result = await getEpisodeService().create(filmId, episode);
        if (result > 0) {
            revalidateTag(CACHE_TAG.EPISODES, "max")
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
            revalidateTag(CACHE_TAG.EPISODES, "max")
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

export async function updateEpisode(id: string, filmId: string, episode: Episode) {
    try {
        const result = await getEpisodeService().patch(id, filmId, episode);
        if (result > 0) {
            revalidateTag(CACHE_TAG.EPISODES, "max")
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

export async function reorderEpisode(id: string, filmId: string, episode: Episode) {
    try {
        const result = await getEpisodeService().reorder(id, filmId, episode);
        if (result > 0) {
            revalidateTag(CACHE_TAG.EPISODES, "max")
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