import { MongoClient } from "mongodb";

let client;

if (!client) {
  client = new MongoClient(process.env.MONGODB_URI ?? "");
  await client.connect();

  const db = client.db("english-note");
  await db.createCollection("users", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["username"],
        properties: {
          username: {
            bsonType: "string",
            description: "Phải là chuỗi và không được bỏ trống.",
          },
        },
      },
    },
    validationLevel: "strict", // Bật chế độ strict từ khi tạo collection
    validationAction: "error", // Mặc định từ chối dữ liệu không hợp lệ
  });

  db.createCollection("words", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["text", "definition"],
        properties: {
          text: {
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

  await db.createCollection("searches", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "wordId", "searchCount"],
        properties: {
          userId: {
            bsonType: "objectId",
            description: "Phải là ObjectId và tham chiếu đến user.",
          },
          wordId: {
            bsonType: "objectId",
            description: "Phải là ObjectId và tham chiếu đến word.",
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
}

export default client;
