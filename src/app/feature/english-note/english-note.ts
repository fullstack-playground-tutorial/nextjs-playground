export type Word = {
  text: string;
  definition: string;
  searchCount?: number;
};
export interface ApiEnglishNoteService {
  search(userId: string, q?: string): Promise<Word[]>;
  load(userId: string, word: string): Promise<Word | null>;
  insert(word: string, definition: string): Promise<boolean>;
}

export interface ApiEnglishNoteRepository {
  search(userId: string, q?: string): Promise<Word[]>;
  load(userId: string, word: string): Promise<Word | null>;
  increase(userId: string, word: string): Promise<boolean>;
  insert(word: string, definition: string): Promise<boolean>;
}

export interface EnglishNoteService {
  insert(text: string, definition: string): Promise<boolean>;
}
