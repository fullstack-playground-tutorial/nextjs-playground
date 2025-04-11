import { METHOD } from "./method";
import { Interceptors } from "./interceptor";
import { ContentType, HeaderType } from "./headers";
import { HTTPResponse } from "./response";
import { ResponseError } from "../exception/model/response-error";

interface HttpDefault {
  timeout?: number;
}

export class HttpService {
  private baseRequestInit: RequestInit = {};
  interceptors: Interceptors;
  isRefreshing: boolean = false;
  requestTimeout?: NodeJS.Timeout;
  // interceptorSubscribers: (() => Promise<Response>)[] = []

  constructor(httpDefault: HttpDefault) {
    this.interceptors = new Interceptors();
    if (httpDefault.timeout) {
      this.setRequestTimeout(httpDefault.timeout);
    }
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
    this.put = this.put.bind(this);
    this.patch = this.patch.bind(this);
    this.delete = this.delete.bind(this);
    this.setRequestTimeout = this.setRequestTimeout.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
  }

  private setRequestTimeout(timeout: number) {
    const abortController = new AbortController();
    this.baseRequestInit.signal = abortController.signal;
    this.requestTimeout = setTimeout(() => {
      abortController.abort();
    }, timeout);
  }

  async sendRequest<T>(
    url: string,
    options: RequestInit
  ): Promise<HTTPResponse<T>> {
    let mergeOptions = { ...this.baseRequestInit, ...options };
    if (this.interceptors.request.config) {
      const configInterceptor = this.interceptors.request.config(options);
      mergeOptions = { ...this.baseRequestInit, ...configInterceptor };
    }

    if (this.isRefreshing) {
      // this.interceptorSubscribers.push(() => {
      //     return fetch(url, mergeOptions)
      // })
      console.log("refreshing ...");
      return new Promise<HTTPResponse<T>>((_, reject) => {
        reject("token is refreshing");
      }).finally(() => clearTimeout(this.requestTimeout));
    } else {
      const res = await fetch(url, mergeOptions).finally(() =>
        clearTimeout(this.requestTimeout)
      );
      return this.handleResponse<T>(res, url, options);
    }
  }

  private async handleResponse<T>(
    res: Response,
    url: string,
    options: RequestInit
  ): Promise<HTTPResponse<T>> {
    try {
      if (this.interceptors.response.onInterceptorResponse) {
        res = await this.interceptors.response.onInterceptorResponse(
          res,
          url,
          this.isRefreshing,
          options
        );
      }
      let contentType = res.headers.get(HeaderType.contentType);
      if (contentType == null) {
        contentType = ContentType.textPlain;
      }

      if (!res.ok) {
        // case 422
        if (res.status == 422) {
          let response = await res.json();
          throw new ResponseError(null, res.status, response);
        } else {
          const errMessage = await res.text();
          throw new ResponseError(errMessage, res.status, null);
        }
      } else {
        if (ContentType.isJson(contentType)) {
          let response = await res.json();
          response = response as T;
          return {
            headers: res.headers,
            body: response,
            status: res.status,
          };
        } else {
          let response = await res.text();
          return {
            headers: res.headers,
            status: res.status,
            body: response as T
          };
        }
      }
    } catch (error) {
      throw error;
    }
  }

  get<T>(url: string, options?: RequestInit): Promise<HTTPResponse<T>> {
    options = { ...this.baseRequestInit, ...options };
    return this.sendRequest<T>(url, { ...options, method: METHOD.GET });
  }

  post<T, B extends Object>(
    url: string,
    body: B,
    options?: RequestInit
  ): Promise<HTTPResponse<T>> {
    options = {
      ...this.baseRequestInit,
      ...options,
      body: JSON.stringify(body),
    };

    return this.sendRequest<T>(url, { ...options, method: METHOD.POST });
  }
  put<T>(
    url: string,
    body: Object,
    options?: RequestInit
  ): Promise<HTTPResponse<T>> {
    options = {
      ...this.baseRequestInit,
      ...options,
      body: JSON.stringify(body),
    };
    return this.sendRequest<T>(url, { ...options, method: METHOD.PUT });
  }
  patch<T>(
    url: string,
    body: Object,
    options?: RequestInit
  ): Promise<HTTPResponse<T>> {
    options = {
      ...this.baseRequestInit,
      ...options,
      body: JSON.stringify(body),
    };
    return this.sendRequest<T>(url, { ...options, method: METHOD.PATCH });
  }
  delete<T>(url: string, options?: RequestInit): Promise<HTTPResponse<T>> {
    options = { ...this.baseRequestInit, ...options };
    return this.sendRequest<T>(url, { ...options, method: METHOD.DELETE });
  }
}
