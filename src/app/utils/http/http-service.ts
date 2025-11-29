"use server";
import { ResponseError } from "../exception/model/response-error";
import { ContentType, HeaderType } from "./headers";
import { Interceptors } from "./interceptor";
import { METHOD } from "./method";
import { HTTPResponse } from "./response";

interface HttpDefault {
  timeout?: number;
  headers?: HeadersInit;
  next?: NextFetchRequestConfig;
  cache?: RequestCache;
}

export type RequestConfig = RequestInit & {
  authSkip?: boolean;
  refreshed?: boolean;
  _isRefresh?: boolean;
};

export type RefreshingState = {
  isRefreshing: boolean;
  queue: Array<(s: boolean) => void>;
};

export interface HTTPService {
  get<T>(url: string, options?: RequestConfig): Promise<HTTPResponse<T>>;
  post<T, B extends object>(
    url: string,
    body: B,
    configOptions?: RequestConfig
  ): Promise<HTTPResponse<T>>;
  put<T>(
    url: string,
    body: object,
    configOptions?: RequestConfig
  ): Promise<HTTPResponse<T>>;
  patch<T>(
    url: string,
    body: object,
    configOptions?: RequestConfig
  ): Promise<HTTPResponse<T>>;
  delele<T>(url: string, options?: RequestConfig): Promise<HTTPResponse<T>>;
}

export const createHttpClient = async (
  httpDefault: HttpDefault = {},
  interceptors?: Interceptors
): Promise<HTTPService> => {
  // Private internal state
  const baseRequestInit: RequestConfig = { refreshed: false };
  const requestTimeout = httpDefault.timeout ?? null;
  const refreshState: RefreshingState = {
    isRefreshing: false,
    queue: [],
  };

  // ====== private helper ======
  const handleResponse = async <T>(
    res: Response,
    url: string,
    options: RequestInit
  ): Promise<HTTPResponse<T>> => {
    try {
      if (interceptors?.response) {
        res = await interceptors.response(res, url, refreshState, options);
      }

      let contentType = res.headers.get(HeaderType.contentType);
      if (contentType == null) {
        contentType = ContentType.build("text/plain", "utf-8");
      }

      if (!res.ok) {
        // Fail case
        if (res.status == 422) {
          const response = await res.json();
          throw new ResponseError(null, res.status, response);
        } else {
          const errMessage = await res.text();
          console.error("ERROR RESPONSE FROM CALL API: ", errMessage);
          throw new ResponseError(errMessage, res.status, null);
        }
      } else {
        // Success case
        if (ContentType.isJson(contentType)) {
          try {
            const json = await res.text();
            const response = JSON.parse(json, dateReviver) as T;

            return {
              headers: res.headers,
              body: response,
              status: res.status,
            };
          } catch (error) {
            // case contentType is application/json but body is text => fallback to text
            const response = (await res.text()) as T;
            return {
              headers: res.headers,
              body: response,
              status: res.status,
            };
          }
        } else {
          const response = (await res.text()) as T;
          return {
            headers: res.headers,
            body: response,
            status: res.status,
          };
        }
      }
    } catch (error) {
      throw error;
    }
  };

  // ====== sendRequest ======
  const sendRequest = async <T>(
    url: string,
    options: RequestConfig
  ): Promise<HTTPResponse<T>> => {
    console.log(`Calling API [HTTP] ${options.method} ${url} `);
    const abortController = new AbortController();
    const timeout = requestTimeout;

    const timer = timeout
      ? setTimeout(() => abortController.abort(), timeout)
      : null;

    let mergeOptions = {
      ...baseRequestInit,
      signal: abortController.signal,
      ...options,
    };

    try {
      if (interceptors?.request) {
        const intercepted = await interceptors.request(options);
        mergeOptions = {
          ...mergeOptions,
          ...intercepted,
        };
      }

      const isRefreshRequest = mergeOptions._isRefresh === true;
      if (refreshState.isRefreshing && !isRefreshRequest) {
        console.log("Waiting for token refresh...");
        return new Promise<HTTPResponse<T>>((resolve, reject) => {
          refreshState.queue.push((success) => {
            if (!success) {
              reject("token refresh failed");
              return;
            }
            // Retry original request after refresh;
            sendRequest<T>(url, options).then(resolve).catch(reject);
          });
        });
      } else {
        const res = await fetch(url, mergeOptions).finally(
          () => timer && clearTimeout(timer)
        );
        return handleResponse<T>(res, url, options);
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.warn(`Request to ${url} timed out after ${timeout}ms`);
        throw new ResponseError("Request timeout", 408, null);
      }

      console.error(` Network error calling ${url}:`, error);
      throw error;
    } finally {
      timer && clearTimeout(timer);
    }
  };

  // ====== public API ======
  const get = async <T>(url: string, options?: RequestConfig) => {
    options = {
      ...baseRequestInit,
      ...options,
    };
    return sendRequest<T>(url, { ...options, method: METHOD.GET });
  };

  const post = async <T, B extends object>(
    url: string,
    body: B,
    options?: RequestConfig
  ) => {
    options = {
      ...baseRequestInit,
      ...options,
      body: JSON.stringify(body),
    };
    return sendRequest<T>(url, { ...options, method: METHOD.POST });
  };

  const put = async <T>(url: string, body: object, options: RequestConfig) => {
    options = {
      ...baseRequestInit,
      ...options,
      body: JSON.stringify(body),
    };
    return sendRequest<T>(url, { ...options, method: METHOD.PUT });
  };

  const patch = async <T>(
    url: string,
    body: object,
    options?: RequestConfig
  ) => {
    options = {
      ...baseRequestInit,
      ...options,
      body: JSON.stringify(body),
    };
    return sendRequest<T>(url, { ...options, method: METHOD.PATCH });
  };

  const delele = async <T>(url: string, options?: RequestConfig) => {
    options = {
      ...baseRequestInit,
      ...options,
    };
    return sendRequest<T>(url, { ...options, method: METHOD.DELETE });
  };

  const dateReviver = (_: string, value: any): any => {
    if (
      typeof value === "string" &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?([+-]\d{2}:\d{2}|Z)$/.test(
        value
      )
    ) {
      return new Date(value);
    }
    return value;
  };

  return {
    get,
    post,
    put,
    patch,
    delele,
  };
};
