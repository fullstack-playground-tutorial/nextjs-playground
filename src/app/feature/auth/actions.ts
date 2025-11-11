"use server";

import { getDeviceId, IP, userAgent } from "@/app/dal";
import { ResponseError } from "@/app/utils/exception/model/response-error";
import { Error422Message } from "@/app/utils/exception/model/response";
import { ValidateErrors } from "@/app/utils/validate/model";
import { InputValidate, createSchemaItem } from "@/app/utils/validate/validate";
import { redirect } from "next/navigation";
import { Account } from "./auth";
import { SignUpFormState } from "@/app/[lang]/(auth)/auth/components/signup";
import { removeCookies, storeCookies } from "../actions";
import { getAuthService } from "@/app/core/server/context";
import { SigninFormState } from "@/app/[lang]/(auth)/auth/components/signin";
import { resource } from "@/app/utils/resource";
import { cookies } from "next/headers";
import { HeaderType } from "@/app/utils/http/headers";

export async function login(
  prevState: SigninFormState,
  formData: FormData
): Promise<SigninFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

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
    return { fieldErrors: errs, loginSuccess: false };
  }
  const deviceId = await getDeviceId();

  try {
    const AuthService = getAuthService();
    const cookies = await AuthService.login(email, password, ua, ip, deviceId);
    await storeCookies(cookies);
    return {
      fieldErrors: {},
      loginSuccess: true,
    };
  } catch (e: any) {
    const err = e as ResponseError<Error422Message[]>;
    if (err.status == 422) {
      const fieldErrs: ValidateErrors = {};
      err.body.forEach((item) => {
        fieldErrs[item.field] = item.message;
      });

      return { fieldErrors: fieldErrs, loginSuccess: false };
    } else {
      throw err;
    }
  }
}

export async function register(
  prevState: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> {
  const account = Object.fromEntries(formData) as Account;

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
    const res = await getAuthService().register(account);
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

export async function logout(f?: FormData) {
  try {
    const deviceId = await getDeviceId();
    const ip = await IP();
    const ua = await userAgent();

    if (deviceId.length == 0 || ua.length == 0 || ip.length == 0) {
      await removeCookies();
    }

    const res = await getAuthService().logout(deviceId, ip, ua);
    if (res > 0) {
      await removeCookies();
      resource.session = {};
      redirect("/");
    }
  } catch (e) {
    await removeCookies();
    resource.session = {};
    throw e;
  }
}

