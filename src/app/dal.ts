"use server";

import { cookies, headers } from "next/headers";
import { HeaderType } from "./utils/http/headers";
import { resource } from "./utils/resource";
import { refreshSession, UserInfo } from "./feature/auth";
import { getAuthService } from "./core/server/context";
import { uuidv4 } from "./utils/random/random";

export const verifySession = async (): Promise<
  "refresh" | "logined" | null
> => {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken");
  const refreshToken = cookiesStore.get("refreshToken");

  if ((!refreshToken && !accessToken) || (accessToken && !refreshToken)) {
    return null;
  }

  if (refreshToken && !accessToken) {
    return "refresh";
  }

  return "logined";
};

interface Session {
  needRefresh: boolean;
}

interface Token {
  payload: AccessTokenPayload;
}

interface AccessTokenPayload {
  userId: string;
  username: string;
}

export async function IP() {
  const headersList = await headers();

  let IP = resource.session.IP ?? "";
  if (IP.length == 0) {
    const FALLBACK_IP_ADDRESS = "0.0.0.0";
    const forwardedFor = headersList.get("x-forwarded-for");

    if (forwardedFor) {
      IP = forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS;
    } else {
      IP = headersList.get("x-real-ip") ?? FALLBACK_IP_ADDRESS;
    }
    resource.setIP(IP);
  }
  return IP;
}

export async function userAgent() {
  const headersList = await headers();
  let ua = resource.session.userAgent;
  if (!ua) {
    ua = headersList.get(HeaderType.userAgent) ?? "";
    resource.setUserAgent(ua);
  }
  return ua;
}

export async function getUser(): Promise<UserInfo> {
  const session = await verifySession();
  if (!session) {
    throw new Error("You must be signed in to perform this action");
  }
  if (session == "refresh") {
    return refreshSession().then(() => getAuthService().me());
  }

  return getAuthService().me();
}

export async function hasPermission(perms: string[]): Promise<boolean> {
  const session = await verifySession();
  if (!session) {
    throw new Error("You must be signed in to perform this action");
  }

  if (session == "refresh") {
    return refreshSession().then(() =>
      getAuthService()
        .me()
        .then((user) => {
          const permissions = user?.permissions ?? [];
          return perms.some((p) => permissions.includes(p));
        })
    );
  }

  return getAuthService()
    .me()
    .then((user) => {
      const permissions = user?.permissions ?? [];
      return perms.some((p) => permissions.includes(p));
    });
}

/**
 * Get Device ID for device. If It hasn't already existed, created new one.
 */
export const getDeviceId = async (): Promise<string> => {
  const cookieStore = await cookies();
  let deviceId = cookieStore.get("deviceId")?.value;
  if (!deviceId) {
    deviceId = uuidv4();
    cookieStore.set("deviceId", deviceId, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    resource.setDeviceId(deviceId);
  }

  return deviceId;
};
