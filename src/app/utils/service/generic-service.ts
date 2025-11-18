import { HTTPService } from "../http";
import { SearchFilter, SearchResult } from "./type";

export interface GenericService<T, F, IdKey extends keyof T> {
  httpService: HTTPService;
  getAll(next?: NextFetchRequestConfig, authSkip?: boolean): Promise<T[]>;
  search(
    filter: Partial<F>,
    next?: NextFetchRequestConfig,
    searchGet?: boolean,
    authSkip?: boolean
  ): Promise<SearchResult<T>>;
  load(
    id: string,
    next?: NextFetchRequestConfig,
    authSkip?: boolean
  ): Promise<T | undefined>;
  create(
    data: Omit<T, IdKey>,
    next?: NextFetchRequestConfig,
    authSkip?: boolean
  ): Promise<number>;
  update(
    id: string,
    data: Partial<T>,
    next?: NextFetchRequestConfig,
    authSkip?: boolean
  ): Promise<number>;
  patch(
    id: string,
    data: Partial<T>,
    next?: NextFetchRequestConfig,
    authSkip?: boolean
  ): Promise<number>;
  remove(
    id: string,
    next?: NextFetchRequestConfig,
    authSkip?: boolean
  ): Promise<number>;
}

export const createGenericService = <T extends Object, F extends SearchFilter,IdKey extends keyof T >(
  httpService: HTTPService,
  url: string,
): GenericService<T, F, IdKey> => {
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
    next: NextFetchRequestConfig,
    searchGet: boolean = false,
    authSkip: boolean = false
  ) {
    const options = { next, authSkip};
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
    next: NextFetchRequestConfig = {revalidate: 60},
    authSkip: boolean = false
  ) {
    const res = await httpService.get<T[]>(url, { next, authSkip });
    return res.body;
  }

  async function load(
    id: string,
    next: NextFetchRequestConfig = {revalidate: 60},
    authSkip: boolean = false
  ) {
    const res = await httpService.get<T>(url + "/" + id, { next, authSkip });
    return res.body;
  }

  async function create(
    data: Omit<T, IdKey>,
    next: NextFetchRequestConfig,
    authSkip: boolean = false
  ) {
    const res = await httpService.post<number, Omit<T, IdKey>>(url, data, {
      next,
      authSkip,
    });
    return res.body;
  }

  async function update(
    id: string,
    data: Partial<T>,
    next: NextFetchRequestConfig,
    authSkip: boolean = false
  ) {
    const res = await httpService.put<number>(url + "/" + id, data, {
      next,
      authSkip,
    });
    return res.body;
  }

  async function patch(
    id: string,
    data: Partial<T>,
    next: NextFetchRequestConfig,
    authSkip: boolean = false
  ) {
    const res = await httpService.patch<number>(url + "/" + id, data, {
      next,
      authSkip,
    });
    return res.body;
  }

  async function remove(
    id: string,
    next: NextFetchRequestConfig,
    authSkip: boolean = false
  ) {
    const res = await httpService.delele<number>(url + "/" + id, {
      authSkip,
      next,
    });
    return res.body;
  }

  return { httpService, getAll, load, create, update, patch, remove, search };
};
