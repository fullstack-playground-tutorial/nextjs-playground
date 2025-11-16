import { ClientSession, Db, MongoClient } from "mongodb";

export class MongoDBClient {
  constructor(private mongoClient: MongoClient) {
    this.init = this.init.bind(this);
    this.withTransaction = this.withTransaction.bind(this);
  }

  async init(callback: () => void) {
    await this.mongoClient.connect();
    callback();
  }

  db(dbName: string): Db {
    return this.mongoClient.db(dbName);
  }

  async withTransaction<T>(cb: () => Promise<T>): Promise<T> {
    const session = this.mongoClient.startSession();
    try {
      const res = session.withTransaction(async () => {
        return cb();
      });
      return res;
    } catch (error) {
      console.error("error: ", error);
      throw error;
    } finally {
      session.endSession();
    }
  }
}

// const mongoClient = new MongoDBClient(
//   new MongoClient(process.env.MONGODB_URI ?? "")
// );

// export default mongoClient;
