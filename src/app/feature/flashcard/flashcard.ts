import { SearchFilter } from "@/app/utils/service/type";

export type FlashcardSet = {
    id: string;
    name: string;
    description?: string;
    isPublic: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
    cards?: Flashcard[];
};

export type Flashcard = {
    id?: string;
    setId?: string;
    front: string;
    back: string;
    example?: string;
    imageUrl?: string;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
    // UI state
    status?: "draft" | "done";
};

export type FlashcardReview = {
    reviewId: string;
    userId: string;
    cardId: string;
    easeFactor: number;
    status: "learning" | "review";
    nextReviewAt: Date;
    lastReviewAt: Date;
    repetition: number;
    interval: number;
};

export type ReviewResult = {
    reviewId: string;
    rate: number; // 0-5
};

export interface FlashcardFilter extends SearchFilter {
    name?: string;
    id?: string;
}
