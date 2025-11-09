import { RefreshingState, RequestConfig } from "./http-service";

export interface Interceptors {
  request: (req: RequestConfig) => RequestConfig | Promise<RequestConfig>;
  response: (response: Response, url: string, refreshingState: RefreshingState, options: RequestConfig) => Promise<Response>;
}

