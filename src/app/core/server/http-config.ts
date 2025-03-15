import { HTTPResponse } from "@/app/utils/http/response";
import { HttpService } from "../../utils/http/http-default";
import { getAuthService } from "./context";
import { storeCookies } from "@/app/feature/actions";
import { getResource } from "@/app/utils/resource";
import { STATUS_CODES } from "http";
import { config } from "@/app/config";

let httpService = new HttpService({ timeout: 30000 });

getHttpService().interceptors.response.use(
  async (response, url, isRefreshing, options) => {
    if (response.status == 401 && !url.includes(`${config.auth_url}/refresh`)) {
      isRefreshing = true;
      console.log("is refreshing ...");
      return await handleStatus401(url, options);
    }
    return response;
  }
);

async function handleStatus401(
  url: string,
  options: RequestInit
): Promise<Response> {
  const { IP, userAgent, deviceId } = getResource().session;

  if (!deviceId || !userAgent || !IP) {
    return new Response(undefined, { status: 401, statusText: "Unauthorized" });
  } else {
    return getAuthService()
      .refresh(deviceId, IP, userAgent)
      .then((res) => {
        if (res) {
          console.log("resfresh successfully");
          storeCookies({ accessToken: res });
          return fetch(url, options);
        } else {
          console.log("refresh failed!");
          return new Response(undefined, {
            status: 401,
            statusText: "Unauthorized",
          });
        }
      })
      .catch((e) => {
        throw e;
      });
  }
}

export function getHttpService() {
  if (!httpService) {
    httpService = new HttpService({
      timeout: 30000,
    });
  }
  return httpService;
}
