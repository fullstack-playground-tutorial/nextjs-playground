import { HTTPService } from "@/app/utils/http";
import { QuizAttempt, QuizAttemptFilter, UserAnswer } from "./quiz-attempt";

export interface QuizAttemptService {
    load(quizId: string, attemptId: string): Promise<QuizAttempt>;
    all(quizId: string): Promise<QuizAttempt[]>;
    create(quizId: string): Promise<string | null>;
    submit(quizId: string, attemptId: string, answers: UserAnswer[]): Promise<number>;
    // syncAllAnswer(attemptId: string, answers: UserAnswer[]): Promise<number>;
}

export const createQuizAttemptService = (http: HTTPService, url: string): QuizAttemptService => {
    return {
        async load(quizId: string, attemptId: string): Promise<QuizAttempt> {
            const res = await http.get<QuizAttempt>(`${url}/${quizId}/attempts/${attemptId}`);
            return res.body || null;
        },
        async all(quizId: string): Promise<QuizAttempt[]> {
            const res = await http.get<QuizAttempt[]>(`${url}/${quizId}/attempts`);
            return res.body || [];
        },
        async create(quizId: string): Promise<string | null> {
            const res = await http.post<string, any>(`${url}/${quizId}/attempts`, {});
            return res.body || null;
        },
        async submit(quizId: string, attemptId: string, answers: UserAnswer[]): Promise<number> {
            const res = await http.patch<any>(`${url}/${quizId}/attempts/${attemptId}/submit`, answers);
            return res ? 1 : 0;
        },
        // async syncAllAnswer(attemptId: string, answers: UserAnswer[]): Promise<number> {
        //     const res = await http.patch<any>(`${url}/${attemptId}/sync-answers`, answers);
        //     return res ? 1 : 0;
        // }
    };
};
