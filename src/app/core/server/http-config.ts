import { cookies } from "next/headers";
import { getDeviceId, IP, userAgent } from "@/app/dal";
import { config } from "@/app/config";
import { HTTPResponse } from "@/app/utils/http/response";
import { createHttpClient } from "@/app/utils/http";
import { HeaderType, ContentType, getCookieHeader } from "@/app/utils/http/headers";

export const httpServiceInstance = createHttpClient({ timeout: 30000 }, {
  response: async (response, url, isRefreshing, options) => {
  if (response.status == 401 && !url.includes(`${config.auth_url}/refresh`)) {
    isRefreshing = true;
    console.log("is refreshing ...");
    handleStatus401(url, options);
  }
  return Promise.resolve(response);
},
request: async (req) => {
    if (!req.authSkip) {
      try {
        const securityHeaders = (await getSecurityHeaders())
        req = { ...req, ...securityHeaders};

      } catch (error) {
        throw error;
      }
    }
    return req
}
});

async function getSecurityHeaders() {
  const deviceId = await getDeviceId();
  const cookieStore = await cookies();
  const id = cookieStore.get("deviceId")?.value;
  const ip = await IP();
  const ua = await userAgent();
  return {
    [HeaderType.contentType]: ContentType.build("application/json", "utf-8"),
    [HeaderType.deviceId]: deviceId,
    [HeaderType.userAgent]: ua,
    [HeaderType.xForwardedFor]: ip,
    [HeaderType.cookie]: await getCookieHeader(),
    apiKey: process.env.KONG_AUTH_APIKEY || "",
  };
}



async function handleStatus401<T>(
  url: string,
  options: RequestInit
): Promise<Response | HTTPResponse<T>> {
  return new Promise(async (resolve, reject) => {
    const deviceId = await getDeviceId();
    const cookieStore = await cookies();
    const id = cookieStore.get("deviceId")?.value;
    const ip = await IP();
    const ua = await userAgent();

    if (!deviceId || !userAgent || !IP || !id) {
      return reject(
        new Response(undefined, {
          status: 401,
          statusText: "Unauthorized",
        })
      );
    }
    
      // getAuthService()
      // .refresh(deviceId, ip, ua)
      // .then((res) => {
      //   if (res) {
      //     console.log("refresh successfully");
      //     storeCookies({ accessToken: res });
      //     return httpServiceInstance.get(url, options);
      //   } else {
      //     console.log("refresh failed!");
      //     reject(
      //       new Response(undefined, {
      //         status: 400,
      //         statusText: "Bad Request",
      //       })
      //     );
      //   }
      // })
      // .catch((e) => {
      //   throw e;
      // })
      // .finally(() => (httpServiceInstance.isRefreshing = false));
  });
}
