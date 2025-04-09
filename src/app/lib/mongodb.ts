import { Db, MongoClient } from "mongodb";

let mongoClient: MongoClient;
let mongoDB: Db;

mongoClient = new MongoClient(process.env.MONGODB_URI ?? "");
await mongoClient.connect();

mongoDB = mongoClient.db("english-note");
await mongoDB.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId"],
      additionalProperties: false,
      properties: {
        userId: {
          bsonType: "string",
          description: "Phải là chuỗi và không được bỏ trống.",
        },
      },
    },
  },
  validationLevel: "strict", // Bật chế độ strict từ khi tạo collection
  validationAction: "error", // Mặc định từ chối dữ liệu không hợp lệ
});

mongoDB.createCollection("words", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [, "word", "definition"],
      additionalProperties: false,
      properties: {
        word: {
          bsonType: "string",
          description: "Phải là chuỗi và không được bỏ trống.",
        },
        definition: {
          bsonType: "string",
          description: "Phải là chuỗi và không được bỏ trống.",
        },
      },
    },
    validationLevel: "strict", // Bật chế độ strict từ khi tạo collection
    validationAction: "error", // Mặc định từ chối dữ liệu không hợp lệ
  },
});

await mongoDB.createCollection("searches", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "word", "searchCount"],
      additionalProperties: false,
      properties: {
        userId: {
          bsonType: "string",
          description: "tham chiếu đến user.",
        },
        word: {
          bsonType: "string",
          description: "tham chiếu đến word.",
        },
        searchCount: {
          bsonType: "int",
          minimum: 0,
          description: "Phải là số nguyên không âm.",
        },
      },
    },
  },
  validationLevel: "strict", // Bật chế độ strict từ khi tạo collection
  validationAction: "error", // Mặc định từ chối dữ liệu không hợp lệ
});

export default mongoDB;
