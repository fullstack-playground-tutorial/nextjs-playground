import { createHttpClient } from "@/app/utils/http";
import {
  ContentType,
  getCookieHeader,
  HeaderType,
} from "@/app/utils/http/headers";

export const httpServiceInstance = await createHttpClient(
  {
    timeout: 500000,
    headers: {
      [HeaderType.contentType]: ContentType.build("application/json", "utf-8"),
    },
    next: {
      revalidate: 3600,
    },
  },
  {
    response: async (response, url, isRefreshing, options) => {
      console.log(`[HTTP] ${options.method} ${url} -> ${response.status}`);

      try {
        // CAUTIOUS: Now we don't handle 401 authorized anymore.
        // // If API require login and response status 401 => refresh token.
        // if (
        //   response.status == 401 &&
        //   !options.authSkip &&
        //   !options._isRefresh
        // ) {
        //   const errMsg = await response.text();
        //   await handleStatus401(url, errMsg, options, isRefreshing);
        // }
        // // Public API or not return 401 => continue.
        return response;
      } catch (error) {
        throw error;
      }
    },
    request: async (req) => {
      // If API require login => attach credentials.
      if (!req.authSkip) {
        req.headers = {
          ...req.headers,
          [HeaderType.cookie]: await getCookieHeader(),
        };
      }

      if (req.body instanceof FormData && req.headers) {
        delete (req.headers as any)[HeaderType.contentType];
      }
      return req;
    },
  }
);

// export const handleStatus401 = async <T>(
//   url: string,
//   errMsg: string,
//   options: RequestConfig,
//   refreshState: RefreshingState
// ): Promise<Response | HTTPResponse<T>> => {
//   // if refreshing, queue requests to start call
//   if (refreshState.isRefreshing) {
//     return new Promise<Response>((resolve, reject) => {
//       refreshState.queue.push((success) => {
//         if (!success) return reject(new Error("refresh failed"));
//         return fetch(url, options).then(resolve).catch(reject);
//       });
//     });
//   }
//   try {
//     // Skip if already refreshed before
//     if (options.refreshed) {
//       throw new Response("Token Invalid", {
//         status: 401,
//       });
//     }

//     // refresh token failed
//     if (errMsg == HTTPERROR.TokenInvalidOrExpired401) {
//       throw new Response("Session Expired", {
//         status: 401,
//       });
//     }

//     // Check already login
//     const cookieStore = await cookies();
//     const accesToken = cookieStore.get(PassportKeys.accessToken);
//     const refreshToken = cookieStore.get(PassportKeys.refreshToken);
//     if (!accesToken || !refreshToken) {
//       throw new Response("User need to login to access this feature", {
//         status: 401,
//       });
//     }

//     // case Unauthorized need to refresh token
//     refreshState.isRefreshing = true;

//     console.log("is refreshing ...");

//     await refreshSession()
//     console.log("refresh successfully");

//     // notify queued requests success
//     refreshState.queue.forEach((cb) => cb(true));
//     refreshState.queue = [];

//     return await httpServiceInstance.get<T>(url, {
//       ...options,
//       refreshed: true,
//     });
//   } catch (e) {
//     // notify queued requests failure
//     refreshState.queue.forEach((cb) => cb(false));
//     refreshState.queue = [];
//     console.log("refresh failed!");
//     throw e;
//   } finally {
//     refreshState.isRefreshing = false;
//   }
// };
