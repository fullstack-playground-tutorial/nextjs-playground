"use server"

import appContext from "@/app/core/server/context"
import { StoryFilter } from "./story"

export const search = async (filter: StoryFilter) => {
    return appContext.getStoryService().all(filter)
     
}