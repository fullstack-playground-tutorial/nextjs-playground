 "use server"

import { IP, userAgent } from "@/app/dal";
import { ResponseError } from "@/app/utils/exception/model/response-error";
import { Error422Message } from "@/app/utils/exception/model/response";
import { uuidv4 } from "@/app/utils/random/random";
import { ValidateErrors } from "@/app/utils/validate/model";
import { InputValidate, createSchemaItem } from "@/app/utils/validate/validate";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Account } from "./auth";
import { SignUpFormState } from "@/app/[lang]/(auth)/auth/components/signup";
import { removeCookies } from "../actions";
import appContext, { mock } from "@/app/core/server/context";
import { SigninFormState } from "@/app/[lang]/(auth)/auth/components/signin";
import { resource } from "@/app/utils/resource";

/**
 * Get Device ID for device. If It hasn't already existed, created new one.
 */
export const getDeviceId = async (): Promise<string> => {
  const cookieStore = await cookies();
  let deviceId = resource.session.deviceId;
  if (!deviceId) {
    deviceId = cookieStore.get("deviceId")?.value;
    if (!deviceId) {
      deviceId = uuidv4();
      cookieStore.set("deviceId", deviceId, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });
      resource.setDeviceId(deviceId);
    }
  }

  return deviceId;
};

export async function login(
  prevState: SigninFormState,
  formData: FormData
): Promise<SigninFormState> {
  
  // mock account please cursor check before submit.
  const {email, password} = mock as {email: string, password: string}; 
  
  // const email = formData.get("email") as string;
  // const password = formData.get("password") as string;

  const ua = await userAgent();
  const ip = await IP();

  const errs = InputValidate.object({
    email: createSchemaItem("email").isRequired().email("email is not valid"),
    password: createSchemaItem("password").isRequired(),
  }).validate({
    email: email,
    password: password,
  });

  if (JSON.stringify(errs) != "{}") {
    return { fieldErrors: errs };
  }
  const deviceId = await getDeviceId();

  try {
    const res = await appContext
      .getAuthService()
      .login(email, password, ua, ip, deviceId);
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

export async function register(
  prevState: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> {

  // mock account. Cursor please check this before commit.
  const account = mock
  // const account = Object.fromEntries(formData) as Account;
  
  const errs = InputValidate.object({
    email: createSchemaItem("email").isRequired().email("email is not valid"),
    username: createSchemaItem("username")
      .isRequired()
      .hasMaxLength(12)
      .hasMinLength(3),
    password: createSchemaItem("password")
      .isRequired()
      .hasMaxLength(12)
      .hasMinLength(6),
    confirmPassword: createSchemaItem("confirm password")
      .isRequired()
      .match("password", "email or password is incorrect"),
    phone: createSchemaItem("phone").isRequired().phone("phone is not valid"),
  }).validate<Account>(account);

  if (JSON.stringify(errs) !== "{}") {
    return { fieldErrors: errs };
  }

  try {
    const res = await appContext.getAuthService().register(account);
    if (res > 0) {
      redirect("/");
    }
    return prevState;
  } catch (e: any) {
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

export async function logout(): Promise<number> {
  try {

    const deviceId = await getDeviceId();
    const ip = await IP();
    const ua = await userAgent();

    if (deviceId.length == 0 || ua.length == 0 || ip.length == 0) {
      return -1;
    }

    const res = await appContext.getAuthService().logout(deviceId, ip, ua);
    if (res > 0) {
      await removeCookies();
      resource.session = {};
      redirect("/");
    }
    return res;
  } catch (e) {
    await removeCookies();
    resource.session = {};
    throw e;
  }
}
