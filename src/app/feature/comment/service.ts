import { HTTPService } from "@/app/utils/http";
import { Thread, Comment, ReactionType } from "./comment";

export interface ThreadService {
  load(
    id: string,
    next?: NextFetchRequestConfig,
    authSkip?: boolean,
  ): Promise<Thread>;
  loadByOwner(
    ownerID: string,
    ownerType: string,
    next?: NextFetchRequestConfig,
    authSkip?: boolean,
  ): Promise<Thread>;
  create(
    data: Thread,
    next?: NextFetchRequestConfig,
    authSkip?: boolean,
  ): Promise<number>;
  update(
    data: Thread,
    next?: NextFetchRequestConfig,
    authSkip?: boolean,
  ): Promise<number>;
  delete(
    id: string,
    next?: NextFetchRequestConfig,
    authSkip?: boolean,
  ): Promise<number>;
  reaction(
    id: string,
    reactionType: ReactionType,
    next?: NextFetchRequestConfig,
    authSkip?: boolean,
  ): Promise<number>;
  unreaction(
    id: string,
    next?: NextFetchRequestConfig,
    authSkip?: boolean,
  ): Promise<number>;
}

export interface CommentService {
  load(
    id: string,
    next?: NextFetchRequestConfig,
    authSkip?: boolean,
  ): Promise<Comment>;
  loadByThread(
    threadID: string,
    next?: NextFetchRequestConfig,
    authSkip?: boolean,
  ): Promise<Comment[]>;
  create(
    data: Comment,
    next?: NextFetchRequestConfig,
    authSkip?: boolean,
  ): Promise<number>;
  update(
    data: Comment,
    next?: NextFetchRequestConfig,
    authSkip?: boolean,
  ): Promise<number>;
  delete(
    id: string,
    next?: NextFetchRequestConfig,
    authSkip?: boolean,
  ): Promise<number>;
  reaction(
    id: string,
    reactionType: ReactionType,
    next?: NextFetchRequestConfig,
    authSkip?: boolean,
  ): Promise<number>;
  unreaction(
    id: string,
    next?: NextFetchRequestConfig,
    authSkip?: boolean,
  ): Promise<number>;
}

export const createThreadService = (
  httpService: HTTPService,
  url: string,
): ThreadService => {
  return {
    load: async (id, next, authSkip) => {
      const response = await httpService.get<Thread>(`${url}/${id}`, {
        next,
        authSkip,
      });
      return response.body;
    },
    loadByOwner: async (ownerID, ownerType, next, authSkip) => {
      const response = await httpService.get<Thread>(
        `${url}/owner/${ownerType}/${ownerID}`,
        { next, authSkip },
      );
      return response.body;
    },
    create: async (data, next, authSkip) => {
      const response = await httpService.post<number, Thread>(`${url}`, data, {
        next,
        authSkip,
      });
      return response.body;
    },
    update: async (data, next, authSkip) => {
      const response = await httpService.patch<number>(`${url}`, data, {
        next,
        authSkip,
      });
      return response.body;
    },
    delete: async (id, next, authSkip) => {
      const response = await httpService.delele<number>(`${url}/${id}`, {
        next,
        authSkip,
      });
      return response.body;
    },
    reaction: async (id, reactionType, next, authSkip) => {
      const response = await httpService.post<number, any>(
        `${url}/${id}/reactions/${reactionType}`,
        {},
        { next, authSkip },
      );
      return response.body;
    },
    unreaction: async (id, next, authSkip) => {
      const response = await httpService.delele<number>(
        `${url}/${id}/reactions`,
        { next, authSkip },
      );
      return response.body;
    },
  };
};

export const createCommentService = (
  httpService: HTTPService,
  url: string,
): CommentService => {
  return {
    load: async (id, next, authSkip) => {
      const response = await httpService.get<Comment>(`${url}/${id}`, {
        next,
        authSkip,
      });
      return response.body;
    },
    loadByThread: async (threadID, next, authSkip) => {
      // Assuming there's an endpoint to load comments by thread ID
      // Go backend should have this: GET /comments/thread/{threadID}
      // Wait, let's check Go routes again.
      const response = await httpService.get<Comment[]>(
        `${url}/thread/${threadID}`,
        { next, authSkip },
      );
      return response.body;
    },
    create: async (data, next, authSkip) => {
      const response = await httpService.post<number, Comment>(`${url}`, data, {
        next,
        authSkip,
      });
      return response.body;
    },
    update: async (data, next, authSkip) => {
      const response = await httpService.patch<number>(`${url}`, data, {
        next,
        authSkip,
      });
      return response.body;
    },
    delete: async (id, next, authSkip) => {
      const response = await httpService.delele<number>(`${url}/${id}`, {
        next,
        authSkip,
      });
      return response.body;
    },
    reaction: async (id, reactionType, next, authSkip) => {
      const response = await httpService.post<number, any>(
        `${url}/${id}/reactions/${reactionType}`,
        {},
        { next, authSkip },
      );
      return response.body;
    },
    unreaction: async (id, next, authSkip) => {
      const response = await httpService.delele<number>(
        `${url}/${id}/reactions`,
        { next, authSkip },
      );
      return response.body;
    },
  };
};
