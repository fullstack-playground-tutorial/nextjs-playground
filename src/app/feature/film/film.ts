import { SearchFilter } from "@/app/utils/service";

export type Interest = {
  id: string;
  title: string;
  mainInterestId?: string;
};

export type Film = {
  id: string;
  title: string;
  subTitle?: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  posterUrl?: string;
  bannerUrl?: string;
  numberOfEpisodes?: number;
  publishedAt?: Date;
  interests: Interest[];
  interestIds: string[];
  trailerUrl?: string;
  director?: string;
  numberOfCurrentEpisodes?: number;
  newestEpisode?: number;
};

export type FilmImages = {
  logo?: File | null;
  poster?: File | null;
  banner?: File | null;
};

export type Source = {
  id: string;
  title: string;
  sourceType:
    | "youtube"
    | "vimeo"
    | "mp4"
    | "hls"
    | "dash"
    | "webm"
    | "mov"
    | "m3u8";
  publishedAt?: Date;
  tracks?: { [key: string]: Track };
  sourceUrls: { [key: string]: string };
};

export type Episode = {
  id: string;
  filmId: string;
  title?: string;
  slug?: string;
  episodeNo: number;
  videoUrl?: string;
  subTitle: string;
  publishedAt?: Date;
  thumbnailUrl?: string;
  description?: string;
  tracks?: { [key: string]: Track };
  sources: Source;
  duration: number; // seconds
};

export interface FilmFilter extends SearchFilter {
  title?: string;
  publishedAt?: Date;
}

export type Track = {
  id: string;
  src: string;
  title: string;
  isDefault?: boolean;
  srcLang?: string;
};
