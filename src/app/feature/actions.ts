"use server";
import { cookies } from "next/headers";
import { Cookie, StoreRequestCookies } from "../utils/http/headers";

export async function storeCookies(cookies: StoreRequestCookies) {
  let k: keyof StoreRequestCookies;
  for (k in cookies) {
    const cookie = cookies[k];
    if (cookie) {
      await storeCookie(k, cookie);
    }
  }
}

export async function storeCookie(key: string, cookie: Cookie) {
  const cookieStore = await cookies();
  cookieStore.set(key, cookie.value, {
    httpOnly: cookie.httpOnly,
    secure: cookie.secure,
    expires: new Date(cookie.expires ?? ""),
    sameSite: cookie.sameSite,
    path: cookie.path
  });
}

export async function removeCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
}
