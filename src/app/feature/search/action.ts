"use server";

import { useSearchService } from "@/app/core/server/context";
import { SearchResult, SearchItem } from "./search";
import { cookies } from "next/headers";

export interface SearchActionState {
  result: SearchResult<SearchItem>;
  userId?: string;
}

export async function search(q: string): Promise<SearchActionState> {
  return useSearchService()
    .search(q)
    .then((res) => {
      const userId = cookies().get("userId")?.value;
      return {
        result: res,
        userId: userId,
      };
    })
    .catch((e) => {
      throw e;
    });
}
