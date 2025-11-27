import { HTTPService } from "../http";

export interface CRUDService<T, IdKey extends keyof T | undefined> {
  httpService: HTTPService;
  getAll(next?: NextFetchRequestConfig, authSkip?: boolean): Promise<T[]>;
  load(
    id: string,
    next?: NextFetchRequestConfig,
    authSkip?: boolean
  ): Promise<T | undefined>;
  create(
    data: IdKey extends keyof T ? Omit<T, IdKey> : T,
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

export const createCRUDService = <
  T extends Object,
  IdKey extends keyof T | undefined
>(
  httpService: HTTPService,
  url: string
): CRUDService<T, IdKey> => {
  async function getAll(
    next: NextFetchRequestConfig = { revalidate: 60 },
    authSkip: boolean = false
  ) {
    const res = await httpService.get<T[]>(url, { next, authSkip });
    return res.body;
  }

  async function load(
    id: string,
    next: NextFetchRequestConfig = { revalidate: 60 },
    authSkip: boolean = false
  ) {
    const res = await httpService.get<T>(url + "/" + id, { next, authSkip });
    return res.body;
  }

  async function create(
    data: IdKey extends keyof T ? Omit<T, IdKey> : T,
    next: NextFetchRequestConfig,
    authSkip: boolean = false
  ) {
    const res = await httpService.post<
      number,
      IdKey extends keyof T ? Omit<T, IdKey> : T
    >(url, data, {
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
  return { httpService, getAll, load, create, update, patch, remove };
};
