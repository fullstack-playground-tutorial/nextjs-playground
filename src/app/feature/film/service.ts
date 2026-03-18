import {
  createGenericWithSearchService,
  CRUDWithSearchService,
} from "@/app/utils/service";
import { Film, FilmFilter, FilmImages } from "./film";
import { HTTPService } from "@/app/utils/http";

export interface FilmService
  extends Omit<CRUDWithSearchService<Film, FilmFilter, "id">, "create" | "patch"> {
  create(films: Film, filmImages: FilmImages, next?: NextFetchRequestConfig, authSkip?: boolean): Promise<number>;
  patch(id: string, film: Partial<Film>, filmImages?: FilmImages, next?: NextFetchRequestConfig, authSkip?: boolean): Promise<number>;
}

export const createFilmService = (
  httpService: HTTPService,
  url: string
): FilmService => {
  const sv = createGenericWithSearchService<Film, FilmFilter, "id">(
    httpService,
    url
  );

  return {
    ...sv,
    create: async (film: Film, filmImages: FilmImages, next?: NextFetchRequestConfig, authSkip?: boolean) => {
      const res = await httpService.post<number, Film>(url, film, {
        files: filmImages,
        next,
        authSkip
      });
      return res.body;
    },
    patch: async (id: string, film: Partial<Film>, filmImages?: FilmImages, next?: NextFetchRequestConfig, authSkip?: boolean) => {
      const res = await httpService.patch<number>(url + "/" + id, film, {
        files: filmImages,
        next,
        authSkip
      });
      return res.body;
    }
  }
}
