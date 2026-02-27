import { HTTPService } from "@/app/utils/http";
import { createGenericWithSearchService, CRUDWithSearchService } from "@/app/utils/service";
import { QuizAttempt, QuizAttemptFilter, UserAnswer } from "./quiz-attempt";

export interface QuizAttemptService extends Omit<CRUDWithSearchService<QuizAttempt, QuizAttemptFilter, "id">, "create"> {
    create(quizId: string): Promise<string | null>;
    submit(attemptId: string, answers: UserAnswer[]): Promise<number>;
    syncAllAnswer(attemptId: string, answers: UserAnswer[]): Promise<number>;
}

export const createQuizAttemptService = (http: HTTPService, url: string): QuizAttemptService => {
    const base = createGenericWithSearchService<QuizAttempt, QuizAttemptFilter, "id">(http, url);
    return {
        ...base,
        async create(quizId: string): Promise<string | null> {
            const res = await http.post<string, any>(`${url.replace("/attempts", "")}/${quizId}/attempts`, {});
            return res.body || null;
        },
        async submit(attemptId: string, answers: UserAnswer[]): Promise<number> {
            const res = await http.patch<any>(`${url}/${attemptId}/submit`, answers);
            return res ? 1 : 0;
        },
        async syncAllAnswer(attemptId: string, answers: UserAnswer[]): Promise<number> {
            const res = await http.patch<any>(`${url}/${attemptId}/sync-answers`, answers);
            return res ? 1 : 0;
        }
    };
};
