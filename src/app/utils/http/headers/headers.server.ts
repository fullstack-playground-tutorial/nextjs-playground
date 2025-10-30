"use server"
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { PassportKeys } from "./constants";

export const getCookieHeader = async () => {
  let cookieHeader = "";
  const cookieService = await cookies();
  cookieService
    .getAll()
    .filter(
      (item) =>
        item.name == PassportKeys.accessToken ||
        item.name == PassportKeys.refreshToken
    )
    .forEach((item) => {
      cookieHeader += parseCookieToString(item);
    });
  return cookieHeader;
};

const parseCookieToString = (cookie: RequestCookie) => {
  return cookie.name + "=" + cookie.value + ";";
};
