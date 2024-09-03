import { AuthService } from "@/app/feature/auth/auth";
import { config } from "../../config";
import { AuthClient } from "@/app/feature/auth/service";
import { HttpService } from "@/app/utils/http/http-default";

import { getHttpService } from "./http-config";
import { StoryClient, StoryService } from "@/app/feature/story";
import { NotificationService } from "@/app/feature/notification/notification";
import { NotificationClient } from "@/app/feature/notification/service";
import { FriendService } from "@/app/feature/friend/friend";
import { FriendClient } from "@/app/feature/friend/service";
import { SearchService } from "@/app/feature/search/search";
import { SearchClient } from "@/app/feature/search/service";

class ApplicationContext {
  private authService?: AuthService;
  private storyService?: StoryService;
  private notificationService?: NotificationService;
  private searchService?: SearchService;
  private friendService?: FriendService;
  private httpService: HttpService;

  constructor(httpService: HttpService) {
    this.getAuthService = this.getAuthService.bind(this);
    this.getStoryService = this.getStoryService.bind(this);
    this.getNotificationService = this.getNotificationService.bind(this);
    this.getFriendService = this.getFriendService.bind(this);
    this.httpService = httpService;
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
}

let context = new ApplicationContext(getHttpService());

export const getApplicationContext = () => {
  if (!context) {
    context = new ApplicationContext(getHttpService());
  }
  return context;
};

export const useAuthService = () => {
  return getApplicationContext().getAuthService();
};

export const useStoryService = () => {
  return getApplicationContext().getStoryService();
};

export const useNotificationService = () => {
  return getApplicationContext().getNotificationService();
};

export const useFriendService = () => {
  return getApplicationContext().getFriendService();
};

export const useSearchService = () => {
  return getApplicationContext().getSearchService();
};
