"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { Base64 } from "./utils/crypto/base64";
import { HeaderType } from "./utils/http/headers";
import { resource } from "./utils/resource";


export const verifySession = async (): Promise<Session | null> => {
  const accessToken = cookies().get("accessToken");
  const refreshToken = cookies().get("refreshToken");

  if (refreshToken && accessToken == undefined) {
    // return "refresh_access_token";
    return null;
  }

  if (accessToken && refreshToken) {
    const token = descryptToken(accessToken.value);
    if (!token) {
      return null;
    }    

    if (verifyToken(token)) {
      resource.session = {
        ...resource, 
        userId: token.payload?.userId,
        username: token.payload?.username
      }
      return {
        isAuth: true,
        payload: token.payload,
      } as Session;
    }
  }

  return null;
};

interface Session {
  isAuth: boolean;
  payload?: AccessTokenPayload;
}

interface Token {
  payload?: AccessTokenPayload;
}

interface AccessTokenPayload {
  userId: string;
  username: string;
}

function verifyToken(token: Token): boolean {
  if (!token.payload) {
    return false;
  }

  if (!token.payload.userId && !token.payload.username) {
    return false;
  }

  return true;
}

function descryptToken(token: string): Token | null {
  const parts = token.split(".");
  if (parts.length != 3) {
    return null;
  }

  const payloadJSON = Base64.DecodeToString(parts[1]);
  const payload: AccessTokenPayload = JSON.parse(payloadJSON);

  return {
    payload: payload,
  };
}

export async function IP() {
  let IP = resource.session.IP ?? "";
  if (IP.length == 0) {
    const FALLBACK_IP_ADDRESS = "0.0.0.0";
    const forwardedFor = headers().get("x-forwarded-for");

    if (forwardedFor) {
      IP = forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS;
    } else {
      IP = headers().get("x-real-ip") ?? FALLBACK_IP_ADDRESS;
    }
    resource.setIP(IP);
  }
  return IP;
}

export async function userAgent() {
  let ua = resource.session.userAgent;
  if (!ua) {
    ua = headers().get(HeaderType.userAgent) ?? "";
    resource.setUserAgent(ua);
  }
  return ua;
}
