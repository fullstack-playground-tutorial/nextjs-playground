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
  imageURLs: string[];
  numberOfEpisodes?: number;
  newestEpisode?: number;
  publishedAt?: Date;
  interests: Interest[];
  interestIds: string[];
  trailerURL?: string;
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
  title?: string;
  subTitle: string;
  description?: string;
  sourceType:
  | "youtube"
  | "vimeo"
  | "mp4"
  | "hls"
  | "dash"
  | "webm"
  | "mov"
  | "m3u8";
  thumbnailUrl?: string;
  publishedAt?: Date;
  tracks?: { [key: string]: Track };
  sourceUrls: Source;
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
