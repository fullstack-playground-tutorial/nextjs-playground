import { SearchFilter } from "@/app/utils/service";

export type QuizAttempt = {
    id: string;
    quizId: string;
    userId: string;
    point: number;
    startAt: Date; // time start attempt
    endAt: Date; // time end attempt
    submittedAt: Date; // time submit attempt
    isSubmitted: boolean;
    createdAt: Date;
    updatedAt: Date;
    questionsSnapshot: AttemptQuestion[];
    userAnswers?: UserAnswer[];
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
    userPoint?: number;
    explanation?: string;
    isUserCorrect?: boolean;
}

export type AttemptQuestionChoice = {
    id: string;
    questionId: string;
    content: string;
    isCorrect?: boolean;
    isSelected?: boolean;
}

export type UserAnswer = {
    id?: string;
    attemptId?: string;
    questionId?: string;
    userAnswerChoices?: UserAnswerChoice[];
    textAnswer?: string;
    isUserCorrect?: boolean;
}


export type UserAnswerChoice = {
    id?: string;
    userAnswerId?: string;
    choiceId?: string;
    isSelected?: boolean;
}