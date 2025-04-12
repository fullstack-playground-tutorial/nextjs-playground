import { ResponseError } from "@/app/utils/exception/model/response-error";
import {
  ApiEnglishNoteRepository,
  ApiEnglishNoteService,
  EnglishNoteService,
  Vocabulary,
} from "./english-note";
import { HttpService } from "@/app/utils/http/http-default";
import { ContentType, HeaderType } from "@/app/utils/http/headers";

export class ApiEnglishNoteClient implements ApiEnglishNoteService {
  constructor(private rp: ApiEnglishNoteRepository) {
    this.search = this.search.bind(this);
    this.insert = this.insert.bind(this);
  }
  async load(userId: string, text: string): Promise<Vocabulary | null> {
    try {
      const word = await this.rp.load(userId, text);
      if (!word) {
        throw new ResponseError("word not found", 404, null);
      } else {
        // Increase number of use for searching word. not required to throw error for this case.
        await this.rp.increase(userId, text);
        return word;
      }
    } catch (error) {
      throw error;
    }
  }

  async insert(
    userId: string,
    word: string,
    definition: string
  ): Promise<boolean> {
    try {
      const existedWord = await this.rp.load(word, definition);
      if (existedWord) {
        console.log(`error: ${word} already exists`);
        throw new ResponseError(`${word} already existed`, 409, null);
      } else {
        return this.rp.transaction(async () => {
          await this.rp.insert(word, definition);
          const res = await this.rp.increase(userId, word);
          return res;
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async search(userId: string, q?: string): Promise<Vocabulary[]> {
    try {
      const words = await this.rp.search(userId, q);
      return words;
    } catch (error) {
      throw error;
    }
  }
}

export class EnglishNoteClient implements EnglishNoteService {
  constructor(
    private httpInstance: HttpService,
    private english_note_url: string
  ) {
    this.insert = this.insert.bind(this);
    this.search = this.search.bind(this);
  }

  async search(q?: string): Promise<Vocabulary[]> {
    const searchParam = new URLSearchParams();
    if (q) {
      searchParam.set("q", q);
    }

    return this.httpInstance
      .get<Vocabulary[]>(this.english_note_url + "/search?" + searchParam.toString())
      .then((res) => res.body)
      .catch((e) => {
        throw e;
      });
  }

  async insert(text: string, definition: string): Promise<boolean> {
    return this.httpInstance
      .post<boolean, Vocabulary>(
        `${this.english_note_url}`,
        {
          word: text,
          definition: definition,
        },
        {
          headers: {
            [HeaderType.contentType]: ContentType.build("application/json", "utf-8"),
          },
          cache: "no-cache",
        }
      )
      .then((res) => {
        return res.body;
      })
      .catch((e) => {
        throw e;
      });
  }
}
