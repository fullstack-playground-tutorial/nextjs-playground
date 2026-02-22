import { SearchFilter } from "@/app/utils/service";

export type Quiz = {
  questions: Question[];
  id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  point: number;
  duration: number;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  questionCount?: number;
};


export type Question = {
  id: string;
  quizId: string;
  content: string;
  type: "single_choice" | "multiple_choice";
  point: number;
  explanation?: string;
  orderIndex: number;
  choices: Choice[];
  answers: string[];
  status: "draft" | "done";
};


export type Choice = {
  id: string;
  questionId: string;
  content: string;
  isCorrect: boolean;
  explanation?: string;
  orderIndex: number;
};

export interface QuizFilter extends SearchFilter {
  title?: string;
  id?: string;
}
