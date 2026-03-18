import {
    createGenericWithSearchService,
    CRUDWithSearchService,
} from "@/app/utils/service/crud-search-service";
import { FlashcardSet, FlashcardFilter, ReviewResult, Flashcard } from "./flashcard";
import { HTTPService } from "@/app/utils/http";

export interface FlashcardService
    extends CRUDWithSearchService<FlashcardSet, FlashcardFilter, "id"> {
    getDueCards(setId: string, number: number): Promise<Flashcard[]>;
    submitReview(setId: string, results: ReviewResult[]): Promise<number>;
}

export const createFlashcardService = (
    httpService: HTTPService,
    url: string
): FlashcardService => {
    const genericSvc = createGenericWithSearchService<FlashcardSet, FlashcardFilter, "id">(
        httpService,
        url
    );

    return {
        ...genericSvc,
        getDueCards: async (setId: string, number: number) => {
            const res = await httpService.get<Flashcard[]>(`${url}/${setId}/due/${number}`);
            return res.body;
        },
        submitReview: async (setId: string, results: ReviewResult[]) => {
            const res = await httpService.post<number, ReviewResult[]>(`${url}/${setId}/review`, results);
            return res.body;
        }
    };
};
