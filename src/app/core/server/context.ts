import { AuthService } from "@/app/feature/auth/auth";
import { AuthClient } from "@/app/feature/auth/service";

import { StoryClient, StoryService } from "@/app/feature/story";
import { NotificationService } from "@/app/feature/notification/notification";
import { NotificationClient } from "@/app/feature/notification/service";
import { FriendService } from "@/app/feature/friend/friend";
import { FriendClient } from "@/app/feature/friend/service";
import { SearchService } from "@/app/feature/search/search";
import { SearchClient } from "@/app/feature/search/service";
import { config } from "@/app/config";
import { EnglishNoteService } from "@/app/feature/english-note/english-note";
import { EnglishNoteClient } from "@/app/feature/english-note/service";
import { HTTPService } from "@/app/utils/http";
import { createTopicService, TopicService } from "@/app/feature/topic";
import {
  createTopicTagService,
  TopicTagService,
} from "@/app/feature/topic-tags";
import { httpServiceInstance } from "./http-config";
import { createRoleService, RoleService } from "@/app/feature/role";
import { createGoldService, GoldService } from "@/app/feature/gold/service";
import {
  createPersonalFinanceService,
  createPFPassbookService,
  PersonalFinanceService,
  PFPassbookService,
} from "@/app/feature/personal-finance/service";

class ApplicationContext {
  private authService?: AuthService;
  private storyService?: StoryService;
  private notificationService?: NotificationService;
  private searchService?: SearchService;
  private friendService?: FriendService;
  // private apiEnglishNoteService?: ApiEnglishNoteService;
  private englishNoteService?: EnglishNoteService;
  private topicService?: TopicService;
  private topicTagService?: TopicTagService;
  private roleService?: RoleService;
  private goldService?: GoldService;
  private personalFinanceService?: PersonalFinanceService;
  private pFPassbookService?: PFPassbookService;

  constructor(private httpService: HTTPService) {
    this.getAuthService = this.getAuthService.bind(this);
    this.getStoryService = this.getStoryService.bind(this);
    this.getNotificationService = this.getNotificationService.bind(this);
    this.getFriendService = this.getFriendService.bind(this);
    this.getEnglishNoteService = this.getEnglishNoteService.bind(this);
    this.getTopicService = this.getTopicService.bind(this);
    this.getTopicTagService = this.getTopicTagService.bind(this);
    this.getRoleService = this.getRoleService.bind(this);
    this.getGoldService = this.getGoldService.bind(this);
    this.getPersonalFinanceService = this.getPersonalFinanceService.bind(this);
    this.getPFPassbookService = this.getPFPassbookService.bind(this);
  }

  getAuthService(): AuthService {
    if (!this.authService) {
      this.authService = new AuthClient(this.httpService, config.auth_url);
    }
    return this.authService;
  }

  getRoleService(): RoleService {
    if (!this.roleService) {
      this.roleService = createRoleService(this.httpService, config.role_url);
    }
    return this.roleService;
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

  getTopicService = () => {
    if (!this.topicService) {
      this.topicService = createTopicService(
        this.httpService,
        config.topic_url
      );
    }
    return this.topicService;
  };

  getTopicTagService = () => {
    if (!this.topicTagService) {
      this.topicTagService = createTopicTagService(
        this.httpService,
        config.topic_tag_url
      );
    }
    return this.topicTagService;
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

  getGoldService = () => {
    if (!this.goldService) {
      this.goldService = createGoldService(this.httpService, config.gold_url);
    }
    return this.goldService;
  };

  getPersonalFinanceService = () => {
    if (!this.personalFinanceService) {
      this.personalFinanceService = createPersonalFinanceService(
        this.httpService,
        config.personal_finance_url
      );
    }
    return this.personalFinanceService;
  };

  getPFPassbookService = () => {
    if (!this.pFPassbookService) {
      this.pFPassbookService = createPFPassbookService(
        this.httpService,
        config.pfpassbook_url
      );
    }
    return this.pFPassbookService;
  };

  // getApiEnglishNoteService = () => {
  //   if (!this.apiEnglishNoteService) {
  //     const englishNoteRepo = new EnglishNoteMongoRepository(
  //       this.mongoDBClient,
  //       "english-note"
  //     );

  //     this.apiEnglishNoteService = new ApiEnglishNoteClient(englishNoteRepo);
  //   }
  //   return this.apiEnglishNoteService;
  // };
}

// await mongoClient.init(async () => {
//   const db = mongoClient.db("english-note");

//   await db.createCollection("users", {
//     validator: {
//       $jsonSchema: {
//         bsonType: "object",
//         required: ["userId"],
//         additionalProperties: false,
//         properties: {
//           _id: {},
//           userId: {
//             bsonType: "string",
//             description: "no blank",
//           },
//         },
//       },
//     },
//     validationLevel: "strict",
//     validationAction: "error",
//   });

//   await db.createCollection("words", {
//     validator: {
//       $jsonSchema: {
//         bsonType: "object",
//         required: ["word", "definition"],
//         additionalProperties: false,
//         properties: {
//           _id: {},
//           word: {
//             bsonType: "string",
//             description: "no blank",
//           },
//           definition: {
//             bsonType: "string",
//             description: "no blank",
//           },
//         },
//       },
//     },
//     validationLevel: "strict",
//     validationAction: "error",
//   });

//   await db.createCollection("searches", {
//     validator: {
//       $jsonSchema: {
//         bsonType: "object",
//         required: ["userId", "word", "searchCount"],
//         additionalProperties: false,
//         properties: {
//           _id: {},
//           userId: {
//             bsonType: "string",
//             description: "reference user.",
//           },
//           word: {
//             bsonType: "string",
//             description: "reference word.",
//           },
//           searchCount: {
//             bsonType: "int",
//             minimum: 0,
//             description: "must greater or equal 0",
//           },
//         },
//       },
//     },
//     validationLevel: "strict",
//     validationAction: "error",
//   });
// });

const appContext = new ApplicationContext(httpServiceInstance);

export const {
  getEnglishNoteService,
  getAuthService,
  getTopicService,
  getTopicTagService,
  getNotificationService,
  getFriendService,
  getSearchService,
  getStoryService,
  getRoleService,
  getGoldService,
  getPersonalFinanceService,
  getPFPassbookService,
} = appContext;
