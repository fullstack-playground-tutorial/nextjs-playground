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

export async function createFilm(film: Film, logoFile: File, posterFile: File, bannerFile: File) {
    try {
        const schema: Schema = {
            title: createSchemaItem("title").isRequired("Title is required"),
            subTitle: createSchemaItem("subTitle").isRequired("Subtitle is required"),
            numberOfEpisodes: createSchemaItem("numberOfEpisodes").hasMin(1).isRequired("Number of episodes is required"),
            publishedAt: createSchemaItem("publishedAt").isRequired("Published at is required"),
            interestIds: createSchemaItem("interestIds").isRequired("Interest is required"),
        }
        const errs = InputValidate.object(schema).validate<Film>(film);

        if (JSON.stringify(errs) !== "{}") {
            return { fieldErrors: errs };
        }


        const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB
        const MAX_GALLERY_SIZE = 5 * 1024 * 1024; // 5MB

        if (logoFile.size > MAX_LOGO_SIZE) {
            return { errMsg: "Logo size must be less than 2MB" };
        }
        if (posterFile.size > MAX_GALLERY_SIZE || bannerFile.size > MAX_GALLERY_SIZE) {
            return { errMsg: "Poster and Banner must be less than 5MB each" };
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