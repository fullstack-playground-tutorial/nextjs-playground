import { cookies } from "next/headers";
import { getDeviceId, IP, userAgent } from "@/app/dal";
import { config } from "@/app/config";
import { HTTPResponse } from "@/app/utils/http/response";
import { createHttpClient, RefreshingState } from "@/app/utils/http";
import { getAuthService } from "./context";
import { storeCookies } from "@/app/feature/actions";
import { HTTPERROR } from "@/app/utils/http/headers/errors";
import { HeaderType, PassportKeys } from "@/app/utils/http/headers";

export const httpServiceInstance = createHttpClient(
  { timeout: 30000 },
  {
    response: async (response, url, isRefreshing, options) => {
      console.log("call api: "+url);
      console.log("response: "+response.status);
      console.log("credentials: "+options.credentials);
      console.log("isRefreshing: "+isRefreshing.isRefreshing);
      console.log("authSkip: "+options.authSkip);
      console.log("headers: "+JSON.stringify(options.headers));
      console.log("body: "+JSON.stringify(options.body));
      console.log("method: "+options.method);
      console.log("url: "+url);      
      console.log("--------------------------------");
      console.log("--------------------------------");
      console.log("--------------------------------");
      try {
        if (response.status == 401 && !options.authSkip) {
          const errMsg = await response.text();
          console.log("is refreshing ...");
          await handleStatus401(url, errMsg, options, isRefreshing);
        }
        return response;
      } catch (error) {
        throw error;
      }
    },
    request: async (req) => {
      if (!req.authSkip) {
        req.credentials = "include"; // to attach token send to server.
      }
      return req;
    },
  }
);

async function handleStatus401<T>(
  url: string,
  errMsg: string,
  options: RequestInit,
  refreshState: RefreshingState
): Promise<Response | HTTPResponse<T>> {
  if (refreshState.isRefreshing) {
    return new Promise<Response>((resolve, reject) => {
      refreshState.queue.push((success) => {
        if (!success) return reject(new Error("refresh failed"));
        // after refresh, retry request but skip auth interceptor
        createHttpClientRetryRequest(url, options).then(resolve).catch(reject);
      });
    });
  }
  refreshState.isRefreshing = true;
  try {
    // refresh token failed
    if (errMsg == HTTPERROR.TokenInvalidOrExpired401) {
      throw new Response("Session Expired", {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    // Check had request attached authorization tokens before sending
    if(options.credentials != "include") {
      throw new Response("client send request but unattached authorization tokens", {
        status: 401, // Unauthorized
        statusText: "Unauthorized",
      });
    }
    
    // Check already login
    const cookieStore = await cookies();
    const accesToken = cookieStore.get(PassportKeys.accessToken);
    const refreshToken = cookieStore.get(PassportKeys.refreshToken);
    if (!accesToken || !refreshToken) {
      throw new Response("User need to login to access this feature", {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    // case Unauthorized need to refresh token
    const id = cookieStore.get(HeaderType.deviceId)?.value;

    const [deviceId, ip, ua] = await Promise.all([
      getDeviceId(),
      IP(),
      userAgent(),
    ]);

    if (
      deviceId.length == 0 ||
      ua.length == 0 ||
      ip.length == 0 ||
      id! ||
      (id && id.length == 0)
    ) {
      throw new Response(undefined, {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    const newAccessToken = await getAuthService().refresh(deviceId, ip, ua);
    console.log("refresh successfully");
    await storeCookies({ accessToken: newAccessToken });

    // notify queued requests success
    refreshState.queue.forEach((cb) => cb(true));
    refreshState.queue = [];

    return await httpServiceInstance.get<T>(url, {...options, authSkip: true});
  } catch (e) {
    // notify queued requests failure
    refreshState.queue.forEach((cb) => cb(false));
    refreshState.queue = [];
    console.log("refresh failed!");
    throw e;
  } finally {
    refreshState.isRefreshing = false;
  }
}

// helper to retry request by creating minimal request (to avoid recursive interceptors if needed)
async function createHttpClientRetryRequest(url: string, options: RequestInit): Promise<Response> {
  // set authSkip so interceptors won't try to refresh again
  const merged = { ...options, authSkip: true };
  // we need a lower-level fetch that won't run through httpServiceInstance's interceptors,
  // so call native fetch directly (but must reconstruct signal, headers if needed)
  return fetch(url, merged as RequestInit);
}