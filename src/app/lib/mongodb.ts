import { Db, MongoClient } from "mongodb";

export class MongoDBClient {
  constructor(private mongoClient: MongoClient) {
    this.init = this.init.bind(this);
  }

  async init(callback: () => void) {
    await this.mongoClient.connect();
    callback();
  }

  db(dbName: string): Db {
    return this.mongoClient.db(dbName);
  }
}

const mongoClient = new MongoDBClient(
  new MongoClient(process.env.MONGODB_URI ?? "")
);

export default mongoClient;
