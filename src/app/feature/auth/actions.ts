"use server";
import { IP, userAgent } from "@/actions";
import { useAuthService } from "@/app/core/server/context";
import { ResponseError } from "@/app/utils/exception/model/response-error";
import { Error422Message } from "@/app/utils/exception/model/response";
import { uuidv4 } from "@/app/utils/random/random";
import { ValidateErrors } from "@/app/utils/validate/model";
import { InputValidate, useSchemaItem } from "@/app/utils/validate/validate";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { FormState } from "@/app/[lang]/@auth/components/signin";

/**
 * Get Device ID for device. If It hasn't already existed, created new one.
 */
export const getDeviceId = (): string => {
  let deviceId = cookies().get("deviceId")?.value;
  if (!deviceId) {
    deviceId = uuidv4();
    cookies().set("deviceId", deviceId, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
  }

  return deviceId;
};

export async function login(_: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const ua = userAgent();
  const ip = IP();

  const errs = InputValidate.object({
    email: useSchemaItem("email").isRequired().email("email is not valid"),
    password: useSchemaItem("password").isRequired(),
  }).validate({
    email: email,
    password: password,
  });

  if (JSON.stringify(errs) != "{}") {
    return { fieldErrors: errs };
  }
  const deviceId = getDeviceId();
  try {
    const res = await useAuthService().login(email, password, ua, ip, deviceId);
    if (res > 0) {
      redirect("/");
    }
    return {
      fieldErrors: {},
    };
  } catch (e: any) {
    const err = e as ResponseError<Error422Message[]>;
    if (err.status == 422) {
      const fieldErrs: ValidateErrors = {};
      err.body.forEach((item) => {
        fieldErrs[item.field] = item.message;
      });

      return { fieldErrors: fieldErrs };
    } else {
      throw err;
    }
  }
}
