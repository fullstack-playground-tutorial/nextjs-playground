import { Db } from "mongodb";
import { ApiEnglishNoteRepository, Word } from "./english-note";

export class EnglishNoteMongoRepository implements ApiEnglishNoteRepository {
  constructor(private db: Db) {
    this.search = this.search.bind(this);
    this.insert = this.insert.bind(this);
    this.load = this.load.bind(this);
    this.increase = this.increase.bind(this);
  }

  async search(userId: string, q?: string): Promise<Word[]> {
    try {
      const res = await this.db
        .collection("searches")
        .aggregate<Word>([
          {
            $match: {
              userId: userId,
              word: { $regex: q, $options: "i" },
            },
          },

          {
            $lookup: {
              from: "words",
              localField: "word",
              foreignField: "word",
              as: "word_info",
            },
          },
          {
            $unwind: "$word_info", // bung object ra khỏi mảng
          },
          {
            $project: {
              _id: 0,
              word: 1,
              definition: "$word_info.definition",
              searchCount: 1,
            },
          },
        ])
        .toArray();
      return res;
    } catch (err) {
      if (err instanceof Error) {
        console.error("MongoDB query error:", err.message);
      } else {
        console.error("Unknown error occurred during MongoDB query", err);
      }
      throw err;
    }
  }

  async insert(word: string, definition: string): Promise<boolean>{
    try {
      const res = await this.db.collection<Word>("words").insertOne({
        text: word,
        definition: definition,
     })
     return res.acknowledged;
    } catch (error) {
      console.log("error: ", error);
      throw error;      
    }
    
  }

  async load(userId: string, word?: string): Promise<Word | null> {
    try {
      const res = await this.db
        .collection("searches")
        .findOne<Word>({ userId: userId, word: word });
      return res;
    } catch (error) {
      console.log("error: ", error);
      throw error;
    }
  }

  async increase(userId: string, word: string): Promise<boolean> {
    try {
      const res = await this.db.collection("searches").updateOne(
        {
          userId: userId,
          word: {
            word: word,
          },
        },
        { $inc: { searchCount: 1 } }
      );
      return res.modifiedCount > 0;
    } catch (error) {
      // not required to throw error for this case.
      console.log("error: ", error);
      return false;
    }
  }
}
