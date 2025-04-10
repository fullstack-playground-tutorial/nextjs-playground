"use server";

import { Word } from "./english-note";
import { createSchemaItem, InputValidate } from "@/app/utils/validate/validate";
import { ValidateErrors } from "@/app/utils/validate/model";
import { getEnglishNoteService } from "@/app/core/server/context";
import { ResponseError } from "@/app/utils/exception/model/response-error";
import { Error422Message } from "@/app/utils/exception/model/response";
import { EnglishNoteActionState } from "@/app/[lang]/(auth)/eng-note/page";

export async function createWord(
  prevState: EnglishNoteActionState,
  formData: FormData
): Promise<EnglishNoteActionState> {
  const text = formData.get("text") as string;
  const definition = formData.get("definition") as string;

  const errs = InputValidate.object({
    text: createSchemaItem("text").isRequired().hasMaxLength(45),
    definition: createSchemaItem("definition").isRequired(),
  }).validate<Word>({ text: text, definition: definition });

  if (Object.keys(errs).length > 0) {
    return { ...prevState, fieldErrs: errs };
  }

  try {
    await getEnglishNoteService().insert(text, definition);
    return {...prevState, fieldErrs: {}};
  } catch (e) {
    if (e instanceof ResponseError) {
      switch (e.status) {
        case 422:
          const fieldErrs: ValidateErrors = {};
          e.body.forEach((item: Error422Message) => {
            fieldErrs[item.field] = item.message;
          });
          return { fieldErrs: fieldErrs };
        default:
          throw e;
      }
    } else {
      throw e;
    }
  }
}
