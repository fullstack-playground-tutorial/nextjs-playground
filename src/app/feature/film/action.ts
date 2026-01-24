"use server";

import { getFilmService } from "@/app/core/server/context";
import { Film } from "./film";
import { updateTag } from "next/cache";
import { CACHE_TAG } from "@/app/utils/cache/tag";
import { InputValidate } from "@/app/utils/validate/validate";
import { Schema, ValidateErrors } from "@/app/utils/validate/model";
import { createSchemaItem } from "@/app/utils/validate/validate";
import { ResponseError } from "@/app/utils/exception/model/response-error";
import { Error422Message } from "@/app/utils/exception/model/response";

const schema: Schema = {
    title: createSchemaItem("title").isRequired(),
    subTitle: createSchemaItem("subTitle").isRequired(),
    slug: createSchemaItem("slug").isRequired(),
    description: createSchemaItem("description").isRequired(),
    logoURL: createSchemaItem("logoURL").isRequired(),
    posterURL: createSchemaItem("posterURL").isRequired(),
    bannerURL: createSchemaItem("bannerURL").isRequired(),
    numberOfEpisodes: createSchemaItem("numberOfEpisodes").isRequired(),
    publishedAt: createSchemaItem("publishedAt").isRequired(),
    interestIds: createSchemaItem("interestIds").isRequired(),
}


export async function createFilm(film: Film, logoFile: File, posterFile: File, bannerFile: File) {
    try {

        const errs = InputValidate.object(schema).validate<Film>(film);

        if (JSON.stringify(errs) !== "{}") {
            return { fieldErrors: errs };
        }

        const result = await getFilmService().create(film, {
            logo: logoFile,
            poster: posterFile,
            banner: bannerFile
        });

        if (result > 0) {
            updateTag(CACHE_TAG.FILMS)
            return { successMsg: "Film created successfully!" };
        } else {
            return { errMsg: "Film created failed!" };
        }

    } catch (e) {
        if (e instanceof ResponseError) {
            switch (e.status) {
                case 422:
                    const fieldErrs: ValidateErrors = {};
                    e.body.forEach((item: Error422Message) => {
                        fieldErrs[item.field] = item.message;
                    });
                    return { fieldErrors: fieldErrs };
                default:
                    throw e;
            }
        } else {
            throw e;
        }
    }
}

export async function updateFilm(id: string, film: Partial<Film>) {
    console.log("Updating film:", id, film);
    return { successMsg: "Film updated successfully! (Mock)" };
}