import { AuthService } from "@/app/feature/auth/auth";
import { AuthClient } from "@/app/feature/auth/service";
import { HttpService } from "@/app/utils/http/http-default";

import { StoryClient, StoryService } from "@/app/feature/story";
import { NotificationService } from "@/app/feature/notification/notification";
import { NotificationClient } from "@/app/feature/notification/service";
import { FriendService } from "@/app/feature/friend/friend";
import { FriendClient } from "@/app/feature/friend/service";
import { SearchService } from "@/app/feature/search/search";
import { SearchClient } from "@/app/feature/search/service";
import { httpServiceInstance } from "./http-config";
import { config } from "@/app/config";
import {
  ApiEnglishNoteService,
  EnglishNoteService,
} from "@/app/feature/english-note/english-note";
import {
  ApiEnglishNoteClient,
  EnglishNoteClient,
} from "@/app/feature/english-note/service";
import { EnglishNoteMongoRepository } from "@/app/feature/english-note/repository";
import { MongoDBClient } from "@/app/lib/mongodb";
import mongoClient from "@/app/lib/mongodb";

class ApplicationContext {
  private authService?: AuthService;
  private storyService?: StoryService;
  private notificationService?: NotificationService;
  private searchService?: SearchService;
  private friendService?: FriendService;
  private apiEnglishNoteService?: ApiEnglishNoteService;
  private englishNoteService?: EnglishNoteService;

  constructor(
    private httpService: HttpService,
    private mongoDBClient: MongoDBClient
  ) {
    this.getAuthService = this.getAuthService.bind(this);
    this.getStoryService = this.getStoryService.bind(this);
    this.getNotificationService = this.getNotificationService.bind(this);
    this.getFriendService = this.getFriendService.bind(this);
    this.getEnglishNoteService = this.getEnglishNoteService.bind(this);
    this.getApiEnglishNoteService = this.getApiEnglishNoteService.bind(this);
  }

  getAuthService(): AuthService {
    if (!this.authService) {
      this.authService = new AuthClient(this.httpService, config.auth_url);
    }
    return this.authService;
  }

  getStoryService(): StoryService {
    if (!this.storyService) {
      this.storyService = new StoryClient(this.httpService, "");
    }
    return this.storyService;
  }

  getNotificationService(): NotificationService {
    if (!this.notificationService) {
      this.notificationService = new NotificationClient(
        this.httpService,
        config.notification_url
      );
    }
    return this.notificationService;
  }

  getFriendService(): FriendService {
    if (!this.friendService) {
      this.friendService = new FriendClient(
        this.httpService,
        config.friend_url
      );
    }
    return this.friendService;
  }

  getSearchService = () => {
    if (!this.searchService) {
      this.searchService = new SearchClient(
        this.httpService,
        config.search_url
      );
    }
    return this.searchService;
  };

  getEnglishNoteService = () => {
    if (!this.englishNoteService) {
      this.englishNoteService = new EnglishNoteClient(
        this.httpService,
        config.english_note_url
      );
    }
    return this.englishNoteService;
  };

  getApiEnglishNoteService = () => {
    if (!this.apiEnglishNoteService) {
      const englishNoteRepo = new EnglishNoteMongoRepository(
        this.mongoDBClient,
        "english-note"
      );

      this.apiEnglishNoteService = new ApiEnglishNoteClient(englishNoteRepo);
    }
    return this.apiEnglishNoteService;
  };
}

await mongoClient.init(async () => {
  const db = mongoClient.db("english-note");

  await db.createCollection("users", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId"],
        additionalProperties: false,
        properties: {
          _id: {},
          userId: {
            bsonType: "string",
            description: "no blank",
          },
        },
      },
    },
    validationLevel: "strict",
    validationAction: "error",
  });

  await db.createCollection("words", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["word", "definition"],
        additionalProperties: false,
        properties: {
          _id: {},
          word: {
            bsonType: "string",
            description: "no blank",
          },
          definition: {
            bsonType: "string",
            description: "no blank",
          },
        },
      },
    },
    validationLevel: "strict",
    validationAction: "error",
  });

  await db.createCollection("searches", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "word", "searchCount"],
        additionalProperties: false,
        properties: {
          _id: {},
          userId: {
            bsonType: "string",
            description: "reference user.",
          },
          word: {
            bsonType: "string",
            description: "reference word.",
          },
          searchCount: {
            bsonType: "int",
            minimum: 0,
            description: "must greater or equal 0",
          },
        },
      },
    },
    validationLevel: "strict",
    validationAction: "error",
  });
});

const appContext = new ApplicationContext(httpServiceInstance, mongoClient);

export const getApiEnglishNoteService = appContext.getApiEnglishNoteService;
export const getEnglishNoteService = appContext.getEnglishNoteService;
export default appContext;
