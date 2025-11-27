import {
  createGenericWithSearchService,
  CRUDWithSearchService,
} from "@/app/utils/service";
import { Topic, TopicFilter } from "./topic";
import { HTTPService } from "@/app/utils/http";

export interface TopicService
  extends CRUDWithSearchService<Topic, TopicFilter, "id"> {}

export const createTopicService = (
  httpService: HTTPService,
  url: string
): TopicService => {
  return createGenericWithSearchService(httpService, url);
};
