import { SearchFilter } from "@/app/utils/service";

export type QuizAttempt = {
    id: string;
    quizId: string;
    userId: string;
    score: number;
    startAt: Date; // time start attempt
    endAt: Date; // time end attempt
    submittedAt: Date; // time submit attempt
    isSubmitted: boolean;
    createdAt: Date;
    updatedAt: Date;
    questionsSnapshot: AttemptQuestion[];
}

export interface QuizAttemptFilter extends SearchFilter {
    isSubmitted?: boolean;
}

export type AttemptQuestion = {
    id: string;
    quizId: string;
    content: string;
    type: "single_choice" | "multiple_choice";
    point: number;
    orderIndex?: number;
    answers?: AttemptQuestionChoice[];
}

export type AttemptQuestionChoice = {
    id: string;
    questionId: string;
    content: string;
}

export type UserAnswer = {
    id: string;
    attemptId: string;
    questionId: string;
    selectedChoiceIds?: string[];
    textAnswer?: string;
}