"use server";

import { getQuizAttemptService } from "@/app/core/server/context";
import { UserAnswer } from "./quiz-attempt";

export async function startQuizAttempt(quizId: string) {
    return await getQuizAttemptService().create(quizId);
}

export async function submitQuizAttempt(quizId: string, attemptId: string, answers: UserAnswer[]) {
    return await getQuizAttemptService().submit(quizId, attemptId, answers);
}

// export async function syncAllAnswer(quizId: string, attemptId: string, answers: UserAnswer[]) {
//     return await getQuizAttemptService().syncAllAnswer(quizId, attemptId, answers);
// }

export async function loadQuizAttempt(quizId: string, attemptId: string) {
    return await getQuizAttemptService().load(quizId, attemptId);
}

// Get all attempts of a quiz of a user
export async function allQuizAttempts(quizId: string) {
    return await getQuizAttemptService().all(quizId);
}
