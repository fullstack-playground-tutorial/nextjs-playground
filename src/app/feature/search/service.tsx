import {
  SearchResult,
  SearchItem,
  SuggestionSearchService,
  SearchService,
} from "./search";
import { config } from "@/app/config";
import {
  ContentType,
  getCookieHeader,
  HeaderType,
} from "@/app/utils/http/headers";
import { ResponseError } from "@/app/utils/exception/model/response-error";
import { HTTPService } from "@/app/utils/http";

export class SuggestionSearchClient<T> implements SuggestionSearchService {
  private search_url = config.search_url;
  constructor(private http: HTTPService) {
    this.search = this.search.bind(this);
    this.delay = this.delay.bind(this);
  }

  delay(t: number) {
    return new Promise((resolve) => setTimeout(resolve, t));
  }

  async search<T>(q: string): Promise<SearchResult<T>> {
    try {
      const res = await this.http.get<SearchResult<T>>(`${this.search_url}`);
      return res.body;
    } catch (e: any) {
      throw new ResponseError(e.body.error.message ?? "", e.status, e.body);
    }
  }
}

export class SearchClient implements SearchService {
  constructor(private http: HTTPService, private search_url: string) {
    this.search = this.search.bind(this);
    this.delay = this.delay.bind(this);
  }
  delay(t: number) {
    return new Promise((resolve) => setTimeout(resolve, t));
  }

  async search<T>(q: string): Promise<SearchResult<T>> {
    try {
      const searchParams = new URLSearchParams({
        q: q,
      });
      const res = await this.http.get<SearchResult<T>>(
        `${this.search_url}?${searchParams}`,
        {
          cache: "no-cache",
          headers: {
            [HeaderType.contentType]: ContentType.build("application/json"),
            [HeaderType.cookie]: await getCookieHeader(),
          },
        }
      );
      return res.body;
    } catch (e) {
      throw e;
    }
  }
}
