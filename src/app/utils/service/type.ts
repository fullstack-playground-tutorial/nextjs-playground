export type SearchResult<T> = {
  list: T[];
  total: number; // used with limit and offset
};

export interface SearchFilter {
  sort?: string;
  limit?: number;
  offset?: number;
  keyword?: string;
}
