export interface FlashcardSet {
    id: string;
    name: string;
    description: string;
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
