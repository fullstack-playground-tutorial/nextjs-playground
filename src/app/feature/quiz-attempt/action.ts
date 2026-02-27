"use server";

import { getQuizAttemptService } from "@/app/core/server/context";
import { UserAnswer } from "./quiz-attempt";

export async function startQuizAttempt(quizId: string) {
    return await getQuizAttemptService().create(quizId);
}

export async function submitQuizAttempt(attemptId: string, answers: UserAnswer[]) {
    return await getQuizAttemptService().submit(attemptId, answers);
}

export async function syncAllAnswer(attemptId: string, answers: UserAnswer[]) {
    return await getQuizAttemptService().syncAllAnswer(attemptId, answers);
}

export async function loadQuizAttempt(attemptId: string) {
    return await getQuizAttemptService().load(attemptId);
}
