"use server"
import { cookies } from "next/headers";
import { Cookie, StoreRequestCookies } from "../utils/http/headers";

export async function storeCookies(req: StoreRequestCookies) {
    let k: keyof StoreRequestCookies;
    for (k in req) {
      const cookie = req[k];
      if (cookie) {
        await storeCookie(k, cookie);
      }
    }
  }
  
  export async function storeCookie(key: string, cookie: Cookie) {
    cookies().set(key, cookie.value, {
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      expires: new Date(cookie.expires ?? ""),
    });
  }
  
  export async function removeCookies() {
    cookies().delete("userId");
    cookies().delete("accessToken");
    cookies().delete("refreshToken");
  }