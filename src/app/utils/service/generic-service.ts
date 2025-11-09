import { HTTPService } from "../http";
import { SearchFilter, SearchResult } from "./type";

export interface GenericService<T, F> {
  httpService: HTTPService;
  getAll(cache?: RequestCache, authSkip?: boolean): Promise<T[]>;
  search(
    filter: Partial<F>,
    cache?: RequestCache,
    searchGet?: boolean,
    authSkip?: boolean
  ): Promise<SearchResult<T>>;
  load(
    id: string,
    cache?: RequestCache,
    authSkip?: boolean
  ): Promise<T | undefined>;
  create(data: Omit<T, "id">, authSkip?: boolean): Promise<number>;
  update(id: string, data: Partial<T>, authSkip?: boolean): Promise<number>;
  patch(id: string, data: Partial<T>, authSkip?: boolean): Promise<number>;
  remove(id: string, authSkip?: boolean): Promise<number>;
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
    searchGet: boolean = false,
    authSkip: boolean = false
  ) {
    const options = { cache, authSkip };
    if (searchGet) {
      const queryURL = buildUrlParams(url + "/search", filter);
      return httpService
        .get<SearchResult<T>>(queryURL, options)
        .then((res) => res.body);
    } else {
      return httpService
        .post<SearchResult<T>, Partial<F>>(url + "/search", filter, options)
        .then((res) => res.body);
    }
  }

  async function getAll(
    cache: RequestCache = "default",
    authSkip: boolean = false
  ) {
    const res = await httpService.get<T[]>(url, { cache, authSkip });
    return res.body;
  }

  async function load(
    id: string,
    cache: RequestCache = "default",
    authSkip: boolean = false
  ) {
    const res = await httpService.get<T>(url + "/" + id, { cache, authSkip });
    return res.body;
  }

  async function create(data: Omit<T, "id">, authSkip: boolean = false) {
    const res = await httpService.post<number, Omit<T, "id">>(url, data, {
      authSkip,
    });
    return res.body;
  }

  async function update(
    id: string,
    data: Partial<T>,
    authSkip: boolean = false
  ) {
    const res = await httpService.put<number>(url + "/" + id, data, {
      authSkip,
    });
    return res.body;
  }

  async function patch(
    id: string,
    data: Partial<T>,
    authSkip: boolean = false
  ) {
    const res = await httpService.patch<number>(url + "/" + id, data, {
      authSkip,
    });
    return res.body;
  }

  async function remove(id: string, authSkip: boolean = false) {
    const res = await httpService.delele<number>(url + "/" + id, { authSkip });
    return res.body;
  }

  return { httpService, getAll, load, create, update, patch, remove, search };
};
