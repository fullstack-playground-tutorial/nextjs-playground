import { HTTPService } from "@/app/utils/http";
import { Episode, ReorderEpisode } from "./episode";

export interface EpisodeService {
  getCollection(
    filmId: string,
    next?: NextFetchRequestConfig,
    authSkip?: boolean,
  ): Promise<Episode[]>;
  load(
    id: string,
    filmId: string,
    next?: NextFetchRequestConfig,
    authSkip?: boolean,
  ): Promise<Episode>;
  create(
    filmId: string,
    data: Episode,
    next?: NextFetchRequestConfig,
    authSkip?: boolean,
  ): Promise<number>;
  patch(
    id: string,
    filmId: string,
    data: Episode,
    next?: NextFetchRequestConfig,
    authSkip?: boolean,
  ): Promise<number>;
  delete(
    id: string,
    filmId: string,
    next?: NextFetchRequestConfig,
    authSkip?: boolean,
  ): Promise<number>;
  reorder(
    id: string,
    filmId: string,
    data: ReorderEpisode,
    next?: NextFetchRequestConfig,
    authSkip?: boolean,
  ): Promise<number>;
}

export const createEpisodeService = (
  httpService: HTTPService,
  url: string,
): EpisodeService => {
  return {
    getCollection: async (
      filmId: string,
      next?: NextFetchRequestConfig,
      authSkip?: boolean,
    ): Promise<Episode[]> => {
      const response = await httpService.get<Episode[]>(
        `${url}/${filmId}/episodes`,
        { next, authSkip },
      );
      return response.body;
    },
    load: async (
      id: string,
      filmId: string,
      next?: NextFetchRequestConfig,
      authSkip?: boolean,
    ): Promise<Episode> => {
      const response = await httpService.get<Episode>(
        `${url}/${filmId}/episodes/${id}`,
        { next, authSkip },
      );
      return response.body;
    },
    create: async (
      filmId: string,
      data: Episode,
      next?: NextFetchRequestConfig,
      authSkip?: boolean,
    ): Promise<number> => {
      const response = await httpService.post<number, Episode>(
        `${url}/${filmId}/episodes`,
        data,
        { next, authSkip },
      );
      return response.body;
    },
    patch: async (
      id: string,
      filmId: string,
      data: Episode,
      next?: NextFetchRequestConfig,
      authSkip?: boolean,
    ): Promise<number> => {
      const response = await httpService.patch<number>(
        `${url}/${filmId}/episodes/${id}`,
        data,
        { next, authSkip },
      );
      return response.body;
    },
    delete: async (
      id: string,
      filmId: string,
      next?: NextFetchRequestConfig,
      authSkip?: boolean,
    ): Promise<number> => {
      const response = await httpService.delele<number>(
        `${url}/${filmId}/episodes/${id}`,
        { next, authSkip },
      );
      return response.body;
    },
    reorder: async (
      id: string,
      filmId: string,
      data: ReorderEpisode,
      next?: NextFetchRequestConfig,
      authSkip?: boolean,
    ): Promise<number> => {
      const response = await httpService.patch<number>(
        `${url}/${filmId}/episodes/${id}/reorder`,
        data,
        { next, authSkip },
      );
      return response.body;
    },
  };
};
