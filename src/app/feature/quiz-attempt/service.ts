import { HTTPService } from "@/app/utils/http";
import { QuizAttempt, UserAnswer } from "./quiz-attempt";

export interface QuizAttemptService {
    load(quizId: string, attemptId: string, next?: NextFetchRequestConfig | undefined, authSkip?: boolean | undefined): Promise<QuizAttempt | null>;
    getReview(quizId: string, attemptId: string, next?: NextFetchRequestConfig | undefined, authSkip?: boolean | undefined): Promise<QuizAttempt | null>;
    create(quizId: string, next?: NextFetchRequestConfig | undefined, authSkip?: boolean | undefined): Promise<string | null>;
    submit(quizId: string, attemptId: string, answers: UserAnswer[], next?: NextFetchRequestConfig | undefined, authSkip?: boolean | undefined): Promise<number>;
    all(quizId: string): Promise<QuizAttempt[]>;

    // syncAllAnswer(quizId: string, attemptId: string, answers: UserAnswer[], next?: NextFetchRequestConfig | undefined, authSkip?: boolean | undefined): Promise<number>;
}

export const createQuizAttemptService = (http: HTTPService, url: string): QuizAttemptService => {
    return {
        async load(quizId: string, attemptId: string, next?: NextFetchRequestConfig | undefined, authSkip?: boolean | undefined): Promise<QuizAttempt | null> {
            const res = await http.get<QuizAttempt>(`${url}/${quizId}/attempts/${attemptId}`, { next, authSkip });
            return res.body || null;
        },
        async getReview(quizId: string, attemptId: string, next?: NextFetchRequestConfig | undefined, authSkip?: boolean | undefined): Promise<QuizAttempt | null> {
            const res = await http.get<QuizAttempt>(`${url}/${quizId}/attempts/${attemptId}/review`, { next, authSkip });
            return res.body || null;
        },
        async create(quizId: string, next?: NextFetchRequestConfig | undefined, authSkip?: boolean | undefined): Promise<string | null> {
            const res = await http.post<string, any>(`${url}/${quizId}/attempts`, {}, { next, authSkip });
            return res.body || null;
        },
        async submit(quizId: string, attemptId: string, answers: UserAnswer[], next?: NextFetchRequestConfig | undefined, authSkip?: boolean | undefined): Promise<number> {
            const res = await http.patch<any>(`${url}/${quizId}/attempts/${attemptId}/submit`, answers, { next, authSkip });
            return res ? 1 : 0;
        },
        async all(quizId: string): Promise<QuizAttempt[]> {
            const res = await http.get<QuizAttempt[]>(`${url}/${quizId}/attempts`);
            return res.body || [];
        },
        // async syncAllAnswer(attemptId: string, answers: UserAnswer[], next?: NextFetchRequestConfig | undefined, authSkip?: boolean | undefined): Promise<number> {
        //     const res = await http.patch<any>(`${url}/${attemptId}/sync-answers`, answers, { next, authSkip });
        //     return res ? 1 : 0;
        // }
    };
};
