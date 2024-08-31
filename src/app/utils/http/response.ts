export interface HttpResponse<T> {
  body: T;
  headers: Headers;
  status: number;
}
