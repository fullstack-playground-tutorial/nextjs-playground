import { HttpService } from "../../utils/http/http-default";
import { useAuthService } from "./context";
import { getDeviceId } from "@/app/feature/auth/actions";
import { storeCookies } from "@/app/feature/actions";
import { cookies } from "next/headers";
import { IP, userAgent } from "@/actions";

let httpService = new HttpService({ timeout: 30000 });

getHttpService().interceptors.response.use(async (response, url, options) => {
  if (response.status == 401) {
    handleStatus401(url, options);
  }
  return response;
});

function handleStatus401(url: string, options: RequestInit) {
  const deviceId = getDeviceId();
  const id = cookies().get("deviceId")?.value;
  const ip = IP();
  const ua = userAgent();

  if (deviceId.length == 0 || ua.length == 0 || !id) {
    Promise.reject(
      new Response(undefined, { status: 400, statusText: "Bad Request" })
    );
  } else {
    return useAuthService()
      .refresh(deviceId, ip, ua)
      .then((res) => {
        if (res) {
          storeCookies({ accessToken: res });
          return getHttpService().get(url, options);
        } else {
          Promise.reject(
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
      .finally(() => (getHttpService().isRefreshing = false));
  }
}

export function getHttpService(): HttpService {
  if (!httpService) {
    httpService = new HttpService({
      timeout: 30000,
    });
  }
  return httpService;
}
