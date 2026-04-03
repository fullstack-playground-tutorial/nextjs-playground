
export type Episode = {
    id: string;
    filmId: string;
    title?: string;
    slug?: string;
    episodeNo: number;
    videoUrl?: string;
    subTitle: string;
    publishedAt?: Date;
    description?: string;
    duration: number; // seconds

    // tracks?: { [key: string]: Track };
    // sources: Source;
    // thumbnailUrl?: string;

};