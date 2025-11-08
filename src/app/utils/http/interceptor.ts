import { RequestConfig } from "./http-service";

export interface Interceptors {
  request: (req: RequestConfig) => RequestConfig | Promise<RequestConfig>;
  response: (response: Response, url: string, isRefreshing: boolean, options: RequestInit) => Promise<Response>;
}

