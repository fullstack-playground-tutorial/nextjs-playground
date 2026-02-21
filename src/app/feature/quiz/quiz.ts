import { SearchFilter } from "@/app/utils/service";

export type Question = {
  id: string;
  question: string;
  choices: Choice[];
  answers: string[];
  point: number;
  status: "draft" | "done";
};

export type Quiz = {
  questions: Question[];
  createAt?: Date;
  point: number;
  title: string;
  description?: string;
  id: string;
  timeout: number;
};

export type Choice = {
  id: string;
  content: string;
  // status: 'draft' | 'submit'
};

export interface QuizFilter extends SearchFilter {
  title?: string;
  id?: string;
}
