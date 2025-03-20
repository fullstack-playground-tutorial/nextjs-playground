import { HttpService } from "../../utils/http/http-default";
import { getDeviceId } from "@/app/feature/auth/actions";
import { storeCookies } from "@/app/feature/actions";
import { cookies } from "next/headers";
import { IP, userAgent } from "@/app/dal";
import appContext from "./context";
import { config } from "@/app/config";
import { HTTPResponse } from "@/app/utils/http/response";

export const httpServiceInstance = new HttpService({ timeout: 30000 });

httpServiceInstance.interceptors.response.use(
  async (response, url, isRefreshing, options) => {
    if (response.status == 401 && !url.includes(`${config.auth_url}/refresh`)) {
      isRefreshing = true;
      console.log("is refreshing ...");
      handleStatus401(url, options);
    }
    return Promise.resolve(response);
  }
);

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
    appContext
      .getAuthService()
      .refresh(deviceId, ip, ua)
      .then((res) => {
        if (res) {
          console.log("resfresh successfully");
          storeCookies({ accessToken: res });
          return httpServiceInstance.get(url, options);
        } else {
          console.log("refresh failed!");
          reject(
            new Response(undefined, {
              status: 400,
              statusText: "Bad Request",
            })
          );
        }
      })
      .catch((e) => {
        throw e;
      })
      .finally(() => (httpServiceInstance.isRefreshing = false));
  });
}
