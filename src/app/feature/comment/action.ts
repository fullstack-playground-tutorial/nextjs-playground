"use server";

import { Thread, Comment, ReactionType } from "./comment";
import { getThreadService, getCommentService } from "@/app/core/server/context";
import { revalidateTag } from "next/cache";
import { CACHE_TAG } from "@/app/utils/cache/tag";

export async function createThread(thread: Thread) {
  try {
    const result = await getThreadService().create(thread);
    if (result > 0) {
      revalidateTag(CACHE_TAG.THREAD + "-" + thread.ownerId, "max");
      return { successMsg: "Thread created successfully!" };
    }
    return { errMsg: "Thread created failed!" };
  } catch (error) {
    return { errMsg: "An error occurred" };
  }
}

export async function createComment(comment: Comment) {
  try {
    const result = await getCommentService().create(comment);
    if (result > 0) {
      revalidateTag(CACHE_TAG.COMMENTS + "-" + comment.threadId, "max");
      return { successMsg: "Comment created successfully!" };
    }
    return { errMsg: "Comment created failed!" };
  } catch (error) {
    return { errMsg: "An error occurred" };
  }
}

export async function reactionThread(
  threadId: string,
  type: ReactionType,
  ownerId: string,
) {
  try {
    const result = await getThreadService().reaction(threadId, type);
    if (result > 0) {
      revalidateTag(CACHE_TAG.THREAD + "-" + ownerId, "max");
      return { successMsg: "Reaction successful!" };
    }
    return { errMsg: "Reaction failed!" };
  } catch (error) {
    return { errMsg: "An error occurred" };
  }
}
export async function getComments(threadId: string) {
  try {
    const result = await getCommentService().loadByThread(threadId, {
      tags: [CACHE_TAG.COMMENTS + "-" + threadId],
    });
    return { data: result };
  } catch (error) {
    return { errMsg: "An error occurred" };
  }
}
