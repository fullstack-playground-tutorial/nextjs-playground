import {
  createGenericWithSearchService,
  CRUDWithSearchService,
} from "@/app/utils/service";
import { Tag, TagFilter } from "./topic-tags";
import { HTTPService } from "@/app/utils/http";

export interface TopicTagService
  extends CRUDWithSearchService<Tag, TagFilter, "id"> {}

export function createTopicTagService(
  httpService: HTTPService,
  url: string
): TopicTagService {
  return createGenericWithSearchService(httpService, url);
}
