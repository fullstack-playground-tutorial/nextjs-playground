"use server";

import { getFlashcardService } from "@/app/core/server/context";
import { FlashcardSet, ReviewResult } from "./flashcard";
import { createSchemaItem, InputValidate } from "@/app/utils/validate/validate";
import { revalidateTag, updateTag } from "next/cache";
import { CACHE_TAG } from "@/app/utils/cache/tag";

export async function createFlashcardSet(set: FlashcardSet) {
    try {
        const validationErrors: Record<string, string> = {};

        const setResult = InputValidate.object({
            name: createSchemaItem("Set name").isRequired(),
        }).validate(set);

        if (setResult.name) validationErrors["name"] = setResult.name;
        if (!set.cards || set.cards.length === 0) {
            validationErrors["cards"] = "Add at least one card";
        }

        if (set.cards) {
            set.cards.forEach((c, i) => {
                const cResult = InputValidate.object({
                    front: createSchemaItem("Front content").isRequired(),
                    back: createSchemaItem("Back content").isRequired(),
                }).validate(c);

                if (cResult.front) validationErrors[`cards.${i}.front`] = cResult.front;
                if (cResult.back) validationErrors[`cards.${i}.back`] = cResult.back;
            });
        }

        if (Object.keys(validationErrors).length > 0) {
            return { validationErrors };
        }

        const res = await getFlashcardService().create(set);
        revalidateTag(CACHE_TAG.FLASHCARDS, "max");
        return {
            successMsg: "Flashcard set created successfully",
            data: res
        };
    } catch (error: any) {
        return { error: error.message || "An error occurred" };
    }
}

export async function updateFlashcardSet(set: FlashcardSet) {
    try {
        const validationErrors: Record<string, string> = {};

        const setResult = InputValidate.object({
            name: createSchemaItem("Set name").isRequired(),
        }).validate(set);

        if (setResult.name) validationErrors["name"] = setResult.name;
        if (!set.cards || set.cards.length === 0) {
            validationErrors["cards"] = "Add at least one card";
        }

        if (set.cards) {
            set.cards.forEach((c, i) => {
                const cResult = InputValidate.object({
                    front: createSchemaItem("Front content").isRequired(),
                    back: createSchemaItem("Back content").isRequired(),
                }).validate(c);

                if (cResult.front) validationErrors[`cards.${i}.front`] = cResult.front;
                if (cResult.back) validationErrors[`cards.${i}.back`] = cResult.back;
            });
        }

        if (Object.keys(validationErrors).length > 0) {
            return { validationErrors };
        }

        const res = await getFlashcardService().patch(set.id, set);
        if (res > 0) {
            revalidateTag(CACHE_TAG.FLASHCARDS, "max");
            updateTag(CACHE_TAG.FLASHCARD + "-" + set.id);
        }
        return { successMsg: "Flashcard set updated successfully" };
    } catch (error: any) {
        return { error: error.message || "An error occurred" };
    }
}

export async function deleteFlashcardSet(id: string) {
    try {
        const res = await getFlashcardService().remove(id);
        if (res > 0) {
            revalidateTag(CACHE_TAG.FLASHCARDS, "max");
            return { successMsg: "Flashcard set deleted successfully" };
        } else {
            throw new Error("Failed to delete flashcard set");
        }
    } catch (error: any) {
        return { error: error.message || "An error occurred" };
    }
}

export async function loadFlashcardSet(id: string) {
    return await getFlashcardService().load(id);
}

export async function getDueCards(setId: string, number: number) {
    return await getFlashcardService().getDueCards(setId, number);
}

export async function submitReview(setId: string, results: ReviewResult[]) {
    try {
        const res = await getFlashcardService().submitReview(setId, results);
        if (res > 0) {
            return { successMsg: "Review submitted successfully" };
        }
        return { error: "Failed to submit review" };
    } catch (error: any) {
        return { error: error.message || "An error occurred" };
    }
}
