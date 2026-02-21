"use server";

import { getQuizService } from "@/app/core/server/context";
import { Quiz } from "./quiz";

export async function createQuiz(quiz: Quiz) {
  try {
    const res = await getQuizService().create({
      ...quiz,
    });
    // revalidateTag(CACHE_TAG.QUIZ_LIST); // Assuming there's a tag for quiz list
    return { successMsg: "Successfully created new quiz", data: res };
  } catch (error: any) {
    return { error: error.message || "An error occurred" };
  }
}

export async function getQuiz(id: string) {
  try {
    const res = await getQuizService().load(id);
    return { data: res };
  } catch (error: any) {
    return { error: error.message || "An error occurred" };
  }
}
