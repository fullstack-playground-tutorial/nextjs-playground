export type Vocabulary = {
  word: string;
  definition: string;
  searchCount?: number;
};
export interface ApiEnglishNoteService {
  search(userId: string, q?: string): Promise<Vocabulary[]>;
  load(userId: string, word: string): Promise<Vocabulary | null>;
  insert(userId: string, word: string, definition: string): Promise<boolean>;
}

export interface ApiEnglishNoteRepository {
  search(userId: string, q?: string): Promise<Vocabulary[]>;
  load(userId: string, word: string): Promise<Vocabulary | null>;
  increase(userId: string, word: string): Promise<boolean>;
  insert(word: string, definition: string): Promise<boolean>;
  transaction<T>(cb: () => Promise<T>): Promise<T>;
}

export interface EnglishNoteService {
  search(q?: string): Promise<string[]>;
  insert(text: string, definition: string): Promise<boolean>;
  load(word: string): Promise<Vocabulary | null>;
}
