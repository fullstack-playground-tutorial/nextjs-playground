"use server";

import { getQuizService } from "@/app/core/server/context";
import { Quiz } from "./quiz";
import { createSchemaItem, InputValidate } from "@/app/utils/validate/validate";
import { revalidateTag, updateTag } from "next/cache";
import { CACHE_TAG } from "@/app/utils/cache/tag";

export async function createQuiz(quiz: Quiz) {
  try {
    // Skip validation if saving as draft
    if (quiz.status == "publish") {
      const validationErrors: Record<string, string> = {};

      // Quiz Level Validation
      const quizResult = InputValidate.object({
        title: createSchemaItem("Quiz title").isRequired(),
      }).validate(quiz);

      if (quizResult.title) validationErrors["title"] = quizResult.title;
      if (!quiz.questions || quiz.questions.length === 0) {
        validationErrors["questions"] = "Add at least one question";
      }

      // Question and Answer Validation
      if (quiz.questions) {
        quiz.questions.forEach((q, i) => {
          const qResult = InputValidate.object({
            content: createSchemaItem("Question content").isRequired(),
            point: createSchemaItem("Points").isRequired().hasMin(0.01),
          }).validate(q);

          if (qResult.content) validationErrors[`questions.${i}.content`] = qResult.content;
          if (qResult.point) validationErrors[`questions.${i}.point`] = qResult.point;

          if (!q.answers || q.answers.length === 0) {
            validationErrors[`questions.${i}.answers`] = "Each question must have at least one answer";
          } else {
            let hasCorrect = false;
            q.answers.forEach((a, j) => {
              const aError = createSchemaItem(`Answer`).isRequired().validate(a.content);
              if (aError) validationErrors[`questions.${i}.answers.${j}.content`] = aError;
              if (a.isCorrect) hasCorrect = true;
            });

            if (!hasCorrect) {
              validationErrors[`questions.${i}.correctAnswer`] = "Please select at least one correct answer";
            }
          }
        });
      }

      if (Object.keys(validationErrors).length > 0) {
        return { validationErrors };
      }
    }

    const res = await getQuizService().create({
      ...quiz,
    });
    return { successMsg: quiz.status === "draft" ? "Quiz saved as draft" : "Quiz published successfully", data: res };
  } catch (error: any) {
    return { error: error.message || "An error occurred" };
  }
}

export async function updateQuiz(quiz: Quiz) {
  try {
    if (quiz.status == "publish") {
      const validationErrors: Record<string, string> = {};

      // Quiz Level Validation
      const quizResult = InputValidate.object({
        title: createSchemaItem("Quiz title").isRequired(),
      }).validate(quiz);

      if (quizResult.title) validationErrors["title"] = quizResult.title;
      if (!quiz.questions || quiz.questions.length === 0) {
        validationErrors["questions"] = "Add at least one question";
      }

      // Question and Answer Validation
      if (quiz.questions) {
        quiz.questions.forEach((q, i) => {
          const qResult = InputValidate.object({
            content: createSchemaItem("Question content").isRequired(),
            point: createSchemaItem("Points").isRequired().hasMin(0.01),
          }).validate(q);

          if (qResult.content) validationErrors[`questions.${i}.content`] = qResult.content;
          if (qResult.point) validationErrors[`questions.${i}.point`] = qResult.point;

          if (!q.answers || q.answers.length === 0) {
            validationErrors[`questions.${i}.answers`] = "Each question must have at least one answer";
          } else {
            let hasCorrect = false;
            q.answers.forEach((a, j) => {
              const aError = createSchemaItem(`Answer`).isRequired().validate(a.content);
              if (aError) validationErrors[`questions.${i}.answers.${j}.content`] = aError;
              if (a.isCorrect) hasCorrect = true;
            });

            if (!hasCorrect) {
              validationErrors[`questions.${i}.correctAnswer`] = "Please select at least one correct answer";
            }
          }
        });
      }

      if (Object.keys(validationErrors).length > 0) {
        return { validationErrors };
      }
    }
    const res = await getQuizService().patch(quiz.id, quiz);
    if (res > 0) {
      revalidateTag(CACHE_TAG.QUIZZES, "max");
      updateTag(CACHE_TAG.QUIZ + "-" + quiz.id);
    }
    return { successMsg: "Quiz updated successfully" };
  } catch (error: any) {
    throw error;
  }
}

export async function deleteQuiz(id: string) {
  try {
    const res = await getQuizService().remove(id);
    if (res > 0) {
      revalidateTag(CACHE_TAG.QUIZZES, "max");
      updateTag(CACHE_TAG.QUIZ + "-" + id);
      return { successMsg: "Quiz deleted successfully" };
    } else {
      throw new Error("Failed to delete quiz");
    }

  } catch (error: any) {
    throw error;
  }
}
export async function loadQuiz(id: string) {
  return await getQuizService().load(id);
}
