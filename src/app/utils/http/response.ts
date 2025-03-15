export interface HTTPResponse<T> {
  body: T;
  headers: Headers;
  status: number;
}
