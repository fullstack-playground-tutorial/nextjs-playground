import { HTTPService } from "../http";
import { SearchFilter, SearchResult } from "./type";

export interface GenericService<T, F> {
  httpService: HTTPService;
  getAll(cache?: RequestCache): Promise<T[]>;
  search(
    filter: Partial<F>,
    cache?: RequestCache,
    searchGet?: boolean
  ): Promise<SearchResult<T>>;
  load(id: string): Promise<T | undefined>;
  create(data: Omit<T, "id">): Promise<number>;
  update(id: string, data: Partial<T>): Promise<number>;
  patch(id: string, data: Partial<T>): Promise<number>;
  remove(id: string): Promise<number>;
}

export const createGenericService = <T extends Object, F extends SearchFilter>(
  httpService: HTTPService,
  url: string
): GenericService<T, F> => {
  function buildUrlParams<F extends Record<string, any>>(
    baseUrl: string,
    filter: Partial<F>
  ) {
    const params = new URLSearchParams();

    Object.entries(filter || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });
    return `${baseUrl}?${params.toString()}`;
  }

  async function search(
    filter: Partial<F>,
    cache: RequestCache = "default",
    searchGet: boolean = false
  ) {
    if (searchGet) {
      const queryURL = buildUrlParams(url + "/search", filter);
      return httpService
        .get<SearchResult<T>>(queryURL, { cache: cache })
        .then((res) => res.body);
    } else {
      return httpService
        .post<SearchResult<T>, Partial<F>>(url + "/search", filter, {
          cache: cache,
        })
        .then((res) => res.body);
    }
  }

  async function getAll(cache?: RequestCache) {
    const res = await httpService.get<T[]>(url, { cache: cache });
    return res.body;
  }

  async function load(id: string, cache?: RequestCache) {
    const res = await httpService.get<T>(url + "/" + id, { cache: cache });
    return res.body;
  }

  async function create(data: T, cache?: RequestCache) {
    const res = await httpService.post<number, T>(url, data, { cache: cache });
    return res.body;
  }

  async function update(id: string, data: Partial<T>, cache?: RequestCache) {
    const res = await httpService.put<number>(url + "/" + id, data, {
      cache: cache,
    });
    return res.body;
  }
  async function patch(id: string, data: Partial<T>, cache?: RequestCache) {
    const res = await httpService.patch<number>(url + "/" + id, data, {
      cache: cache,
    });
    return res.body;
  }
  async function remove(id: string, cache?: RequestCache) {
    const res = await httpService.delele<number>(url + "/" + id, {
      cache: cache,
    });
    return res.body;
  }
  return {
    httpService,
    getAll,
    load,
    create,
    update,
    patch,
    remove,
    search,
  };
};
