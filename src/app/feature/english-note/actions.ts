"use server";

import { Vocabulary } from "./english-note";
import { createSchemaItem, InputValidate } from "@/app/utils/validate/validate";
import { ValidateErrors } from "@/app/utils/validate/model";
import { getEnglishNoteService } from "@/app/core/server/context";
import { ResponseError } from "@/app/utils/exception/model/response-error";
import { Error422Message } from "@/app/utils/exception/model/response";
import { EnglishNoteActionState } from "@/app/[lang]/(auth)/eng-note/components/definition-form";

const sanitize = (str: string) =>
  str.replace(/[\x00-\x1F\x7F-\x9F]/g, "").trim();

export async function createWord(
  prevState: EnglishNoteActionState,
  formData: FormData
): Promise<EnglishNoteActionState> {
  const word = sanitize(formData.get("word") as string);
  const definition = sanitize(formData.get("definition") as string);

  const errs = InputValidate.object({
    word: createSchemaItem("word").isRequired().hasMaxLength(45),
    definition: createSchemaItem("definition").isRequired(),
  }).validate<Vocabulary>({ word: word.trim(), definition: definition.trim() });

  if (Object.keys(errs).length > 0) {
    return { ...prevState, fieldErrs: errs };
  }

  try {
    await getEnglishNoteService().insert(word, definition);
    return { ...prevState, fieldErrs: undefined };
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

export async function search(q?: string): Promise<Vocabulary[]> {
  return getEnglishNoteService().search(q ? sanitize(q) : q)
}
