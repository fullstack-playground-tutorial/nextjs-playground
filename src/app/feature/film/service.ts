import {
  createGenericWithSearchService,
  CRUDWithSearchService,
} from "@/app/utils/service";
import { Film, FilmFilter } from "./film";
import { HTTPService } from "@/app/utils/http";

export interface FilmService
  extends CRUDWithSearchService<Film, FilmFilter, "id"> {}

export const createFilmService = (
  httpService: HTTPService,
  url: string
): FilmService => {
  return createGenericWithSearchService<Film, FilmFilter, "id">(
    httpService,
    url
  );
};
