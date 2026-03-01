"use server";

import { getQuizAttemptService } from "@/app/core/server/context";
import { UserAnswer } from "./quiz-attempt";

export async function startQuizAttempt(quizId: string) {
    return await getQuizAttemptService().create(quizId);
}

export async function submitQuizAttempt(quizId: string, attemptId: string, answers: UserAnswer[]) {
    try {
        const res = await getQuizAttemptService().submit(quizId, attemptId, answers);
        return res;
    } catch (error) {
        console.error("ERROR RESPONSE FROM CALL API: ", error);
        throw error;
    }
}

