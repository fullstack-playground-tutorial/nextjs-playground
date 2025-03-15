export class Interceptors {
  request: InterceptorRequest;
  response: InterceptorResponse;

  constructor() {
    this.request = new InterceptorRequest();
    this.response = new InterceptorResponse();
  }
}

class InterceptorRequest {
  config?: (req: RequestInit) => RequestInit;
  constructor() {
    this.use = this.use.bind(this);
  }

  use(callback: (req: RequestInit) => RequestInit): void {
    this.config = callback;
    return;
  }
}

class InterceptorResponse {
  onIntercepterResponse?: (
    response: Response,
    url: string,
    isRefreshing: boolean,
    options: RequestInit
  ) => Promise<Response>;
  constructor() {
    this.use = this.use.bind(this);
  }

  async use(
    callback: (
      response: Response,
      url: string,
      isRefreshing: boolean,
      options: RequestInit
    ) => Promise<Response>
  ) {
    this.onIntercepterResponse = callback;
    return;
  }
}
