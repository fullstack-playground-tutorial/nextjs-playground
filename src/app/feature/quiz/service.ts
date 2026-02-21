import { HTTPService } from "@/app/utils/http";
import type { Quiz, QuizFilter } from "./quiz";
import {
  createGenericWithSearchService,
  CRUDWithSearchService,
} from "@/app/utils/service";

export let mockQuizList: Quiz[] = [
  {
    questions: [
      {
        id: "q1",
        question: "Please choose A",
        choices: [
          {
            id: "A",
            content: "A",
          },
          {
            id: "B",
            content: "B",
          },
          {
            id: "C",
            content: "C",
          },
          {
            id: "D",
            content: "D",
          },
        ],
        answers: ["A"],
        point: 3,
        status: "done",
      },
      {
        id: "q2",
        question: "Please choose B",
        choices: [
          {
            id: "A",
            content: "A",
          },
          {
            id: "B",
            content: "B",
          },
          {
            id: "C",
            content: "C",
          },
          {
            id: "D",
            content: "D",
          },
        ],
        answers: ["B"],
        point: 3,
        status: "done",
      },
      {
        id: "q3",
        question: "Please choose C",
        choices: [
          {
            id: "A",
            content: "A",
          },
          {
            id: "B",
            content: "B",
          },
          {
            id: "C",
            content: "C",
          },
          {
            id: "D",
            content: "D",
          },
        ],
        answers: ["C"],
        point: 4,
        status: "done",
      },
      {
        id: "q4",
        question: "Please choose D",
        choices: [
          {
            id: "A",
            content: "A",
          },
          {
            id: "B",
            content: "B",
          },
          {
            id: "C",
            content: "C",
          },
          {
            id: "D",
            content: "D",
          },
        ],
        answers: ["D"],
        point: 10,
        status: "done",
      },
    ],
    point: 10,
    title: "Test 1",
    id: "1",
    timeout: 60, // seconds
  },
];

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
