import { SearchFilter } from "@/app/utils/service";

export type Quiz = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  status: "draft" | "published" | "archived" | "closed";
  duration: number; // in minutes
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  questionCount?: number;
  questions: Question[];
};


export type Question = {
  id?: string;
  quizId?: string;
  content: string;
  type: "single_choice" | "multiple_choice";
  point: number;
  explanation?: string;
  orderIndex?: number;
  answers: Answer[];
  status: "draft" | "done"; // UI state
};


export type Answer = {
  id?: string;
  questionId?: string;
  content: string;
  isCorrect: boolean;
  explanation?: string;
  orderIndex?: number;
};



export interface QuizFilter extends SearchFilter {
  title?: string;
  id?: string;
}
