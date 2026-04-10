export interface FlashcardSet {
    id: string;
    name: string;
    description: string;
    isPublic?: boolean;
    cards: Flashcard[];
    createdBy?: string;
    createdAt?: Date;
    updatedBy?: string;
    updatedAt?: Date;
}
export interface Flashcard {
    id: string;
    setId: string;
    front: string;
    back: string;
    example?: string;
    imageUrl?: string;
    status?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface FlashcardReviews {
    id: string;
    cardId: string;
    userId: string;
    easeFactor: number;
    interval: number;
    repetition: number;
    nextReviewAt: Date;
    lastReviewAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface FlashcardFilter {
    name?: string;
    createdBy?: string;
}

export interface ReviewResult {
    reviewId: string;
    rate: number;
}
