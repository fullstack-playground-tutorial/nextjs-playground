export interface SearchItem {
  type?: "user";
  avatarURL?: string;
  id?: string;
  name?: string;
  description?:string;
  friendStatus?: FriendStatus;
}

export type FriendStatus = | "A" | "P" | "R" | "C" | "U"

export interface SearchResult<T> {
  list: T[]
  total: number
}

export interface SuggestionSearchService {
  search(q: string): Promise<SearchResult<SearchItem>>;
}

export interface SearchService {
  search(q: string): Promise<SearchResult<SearchItem>>;
}
