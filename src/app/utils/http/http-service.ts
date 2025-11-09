import { ResponseError } from "../exception/model/response-error";
import { ContentType, HeaderType } from "./headers";
import { Interceptors } from "./interceptor";
import { METHOD } from "./method";
import { HTTPResponse } from "./response";

interface HttpDefault {
  timeout?: number;
}

export type RequestConfig = RequestInit & { authSkip?: boolean };

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

export const createHttpClient = (
  httpDefault: HttpDefault = {},
  interceptors?: Interceptors
): HTTPService => {
  // Private internal state (đóng gói bằng closure)
  const baseRequestInit: RequestInit = {};
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
        if (res.status == 422) {
          const response = await res.json();
          throw new ResponseError(null, res.status, response);
        } else {
          const errMessage = await res.text();
          console.error("ERROR RESPONSE FROM CALL API: ", errMessage);
          throw new ResponseError(errMessage, res.status, null);
        }
      } else {
        if (ContentType.isJson(contentType)) {
          const response = (await res.json()) as T;
          return {
            headers: res.headers,
            body: response,
            status: res.status,
          };
        } else {
          const errMessage = await res.text();
          console.error("ERROR RESPONSE FROM CALL API: ", errMessage);
          throw new ResponseError(errMessage, res.status, null);
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
    console.log("fetching API ...");
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

    if (interceptors?.request) {
      const configInterceptor = await interceptors.request(options);
      mergeOptions = {
        ...mergeOptions,
        ...configInterceptor,
      };
    }

    // Store tmp variable for retrying logic after.
    const hadAuthSkip = (mergeOptions as any).authSkip === true;
    // Remove authSkip before fetching (fetch unknow this property)
    delete (mergeOptions as any).authSkip;

    if (refreshState.isRefreshing) {
      console.log("refreshing ...");
      return new Promise<HTTPResponse<T>>((resolve, reject) => {
        refreshState.queue.push((success) => {
          if (!success) {
            reject("token is refreshing");
            return;
          }
          // retry original request after refresh; set authSkip to true to avoid loop
          sendRequest<T>(url, { ...options, authSkip: true })
            .then(resolve)
            .catch(reject);
        });
      }).finally(() => timer && clearTimeout(timer));
    } else {
      const res = await fetch(url, mergeOptions).finally(
        () => timer && clearTimeout(timer)
      );
      return handleResponse<T>(res, url, options);
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

  return {
    get,
    post,
    put,
    patch,
    delele,
  };
};
