"use server";

import appContext from "@/app/core/server/context";
import { SearchResult, SearchItem } from "./search";
import { cookies } from "next/headers";

export interface SearchActionState {
  result: SearchResult<SearchItem>;
  userId?: string;
}

export async function search(q: string): Promise<SearchActionState> {
  const cookieService = await cookies()
  return appContext.getSearchService()
    .search(q)
    .then((res) => {
      const userId = cookieService.get("userId")?.value;
      return {
        result: res,
        userId: userId,
      };
    })
    .catch((e) => {
      throw e;
    });
}
