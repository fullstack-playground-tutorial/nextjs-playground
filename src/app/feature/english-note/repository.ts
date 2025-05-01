import { Db, Document, MongoClient } from "mongodb";
import { ApiEnglishNoteRepository, Vocabulary } from "./english-note";
import { MongoDBClient } from "@/app/lib/mongodb";

export class EnglishNoteMongoRepository implements ApiEnglishNoteRepository {
  private readonly db: Db;
  constructor(private client: MongoDBClient, dbName: string) {
    this.db = client.db(dbName);
    this.search = this.search.bind(this);
    this.insert = this.insert.bind(this);
    this.load = this.load.bind(this);
    this.increase = this.increase.bind(this);
    this.transaction = this.transaction.bind(this);
  }

  async search(userId: string, q?: string): Promise<Vocabulary[]> {
    const pipeline: Document[] = [
      {
        $match: {
          ...(q ? { word: { $regex: q, $options: "i" } } : {}),
          userId: userId,
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
        $unwind: "$word_info",
      },
      {
        $project: {
          _id: 0,
          word: 1,
          definition: "$word_info.definition",
          searchCount: 1,
        },
      },
    ];

    try {
      const res = await this.db
        .collection("searches")
        .aggregate<Vocabulary>(pipeline)
        .toArray();

      return res;
    } catch (err) {
      if (err instanceof Error) {
        console.error("MongoDB query error:", err);
      } else {
        console.error("Unknown error occurred during MongoDB query", err);
      }
      console.log(JSON.stringify(err));

      throw err;
    }
  }

  async insert(word: string, definition: string): Promise<boolean> {    
    try {
      const res = await this.db.collection("words").insertOne({
        word: word,
        definition: definition,
      });
      return res.acknowledged;
    } catch (error: any) {
      console.error("error: ", JSON.stringify(error, null, 2));
      throw error;
    }
  }

  async load(userId: string, word?: string): Promise<Vocabulary | null> {
    try {
      const res = await this.db
        .collection("searches")
        .findOne<Vocabulary>({ userId: userId, word: word });
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
          word: word,
        },
        { $inc: { searchCount: 1 } },
        { upsert: true }
      );
      return res.modifiedCount > 0;
    } catch (error) {
      // not required to throw error for this case.
      console.log("error: ", error);
      return false;
    }
  }

  async transaction<T>(cb: () => Promise<T>) {
    return this.client.withTransaction<T>(cb);
  }
}
