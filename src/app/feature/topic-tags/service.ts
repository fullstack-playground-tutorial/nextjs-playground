import { createGenericService, GenericService } from "@/app/utils/service";
import { Tag, TagFilter } from "./topic-tags";
import { HTTPService } from "@/app/utils/http";

export interface TopicTagService extends GenericService<Tag, TagFilter, "id">{}

export function createTopicTagService(httpService: HTTPService, url: string):TopicTagService {
    return createGenericService(httpService, url)
}