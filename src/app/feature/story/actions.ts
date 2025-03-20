"use server";

import { StoryFilter } from "./story";
import { InputValidate, createSchemaItem } from "@/app/utils/validate/validate";
import { ValidateErrors } from "@/app/utils/validate/model";
import { redirect } from "next/navigation";
import { ResponseError } from "@/app/utils/exception/model/response-error";
import { Error422Message } from "@/app/utils/exception/model/response";
import appContext from "@/app/core/server/context";
import { IP, userAgent } from "@/app/dal";

export const search = async (filter: StoryFilter) => {
  return appContext.getStoryService().all(filter);
};

export interface StoryActionState {
  fieldErrors: ValidateErrors;
}

export const create = async (
  text: string,
  prevState: StoryActionState,
  formData: FormData,
): Promise<StoryActionState> => {
  const ua = await userAgent();
  const ip = await IP();
  const errs = InputValidate.object({
    text: createSchemaItem("text").hasMaxLength(6000).isRequired(),
  }).validate({ text: text });
  if (JSON.stringify(errs) !== "{}") {
    return { ...prevState, fieldErrors: errs };
  }
  try {
    // hard code
    return { ...prevState, fieldErrors: {} };
  } catch (err: any) {
    const e = err as ResponseError<Error422Message[]>;

    if (e.status == 422) {
      const fieldErrs: ValidateErrors = {};
      e.body.forEach((item) => {
        fieldErrs[item.field] = item.message;
      });

      return { ...prevState, fieldErrors: fieldErrs };
    } else {
      throw e;
    }
  }
};
