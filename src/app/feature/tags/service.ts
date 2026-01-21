import {
  createGenericWithSearchService,
  CRUDWithSearchService,
} from "@/app/utils/service";
import { Tag, TagFilter } from "./topic-tags";
import { HTTPService } from "@/app/utils/http";

export interface TagService
  extends CRUDWithSearchService<Tag, TagFilter, "id"> {}

export function createTagService(
  httpService: HTTPService,
  url: string
): TagService {
  return createGenericWithSearchService(httpService, url);
}
