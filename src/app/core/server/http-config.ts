"use server";
import { HttpService } from "../../utils/http/http-default";
import { useAuthService } from "./context";
import { getDeviceId } from "@/app/feature/auth/actions";
import { storeCookies } from "@/app/feature/actions";
import { cookies } from "next/headers";
import { IP, userAgent } from "@/actions";

let httpInstance = new HttpService({timeout: 30000});

httpInstance.interceptors.response.use(async (response, url, options) => {
  
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
          return httpInstance.get(url, options);
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
      .finally(() => (httpInstance.isRefreshing = false));
  }
}
export const getHTTPService = () => {
  if (!httpInstance) {
    httpInstance = new HttpService({
      timeout: 30000,
    });
  }
  
  return httpInstance;
};
