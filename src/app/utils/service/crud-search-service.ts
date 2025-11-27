import { HTTPService } from "../http";
import { createCRUDService, CRUDService } from "./crud-service";
import { SearchFilter, SearchResult } from "./type";

export interface CRUDWithSearchService<T, F, IdKey extends keyof T | undefined>
  extends CRUDService<T, IdKey> {
  httpService: HTTPService;
  search(
    filter: Partial<F>,
    next?: NextFetchRequestConfig,
    searchGet?: boolean,
    authSkip?: boolean
  ): Promise<SearchResult<T>>;
}

export const createGenericWithSearchService = <
  T extends Object,
  F extends SearchFilter,
  IdKey extends keyof T | undefined
>(
  httpService: HTTPService,
  url: string
): CRUDWithSearchService<T, F, IdKey> => {
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
    const options = { next, authSkip };
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

  const crudSvc = createCRUDService<T, IdKey>(httpService, url);

  return { ...crudSvc, search };
};
