"use server"

import { useStoryService } from "@/app/core/server/context"
import { StoryFilter } from "./story"

export const search = async (filter: StoryFilter) => {
    return useStoryService().all(filter)
     
}