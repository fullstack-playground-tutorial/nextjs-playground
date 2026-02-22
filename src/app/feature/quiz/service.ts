import { HTTPService } from "@/app/utils/http";
import type { Quiz, QuizFilter } from "./quiz";
import {
  createGenericWithSearchService,
  CRUDWithSearchService,
} from "@/app/utils/service";

export interface QuizService extends Omit<
  CRUDWithSearchService<Quiz, QuizFilter, "id">,
  "create"
> {
  create(
    quiz: Quiz,
    next?: NextFetchRequestConfig,
    authSkip?: boolean,
  ): Promise<number>;
}

export const createQuizService = (
  httpService: HTTPService,
  url: string,
): QuizService => {
  return createGenericWithSearchService<Quiz, QuizFilter, "id">(
    httpService,
    url,
  );
};
