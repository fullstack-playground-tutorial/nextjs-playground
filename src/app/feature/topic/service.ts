import { createGenericService, GenericService } from "@/app/utils/service";
import { Topic, TopicFilter } from "./topic";
import { HTTPService } from "@/app/utils/http";

export interface TopicService extends GenericService<Topic, TopicFilter, "id"> {}

export const createTopicService = (
  httpService: HTTPService,
  url: string
): TopicService => {
  return createGenericService(httpService, url);
};
