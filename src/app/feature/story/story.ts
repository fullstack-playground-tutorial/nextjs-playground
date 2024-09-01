import { Filter } from "../services/base/search";

export interface StoryService {
  all(filter: StoryFilter): Promise<Story[]>;
}

export interface StoryFilter extends Filter {
  excludeComment?: boolean
  createdAt?: Date
}

export interface Comment {
  id: number;
  postId: number;
  owner: ShortUserInfo;
  comment: string;
  emotions: Emotions;
  images: string[];
  reply: Comment[];
  status: 'DELETED' | 'CREATED' | 'EDITTED'
  histories: History[];
}


export interface Story {
  id?: string;
  author?: ShortUserInfo;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  history?: string;
  content?: string;
  media?: Media;
  comment?: string;
  expression?: Expression;
}

interface Expression {
  emotions: Emotions;
  shared: {
    total: number;
    users: ShortUserInfo[];
  };
}

export interface Emotions extends Record<EmotionType, Emotion> {}

interface Emotion {
  total: number;
  users: ShortUserInfo[];
}

type EmotionType = "like" | "angry" | "suprised" | "cry"| "happy";

export interface ShortUserInfo {
  authorId: string;
  username: string;
  avatarURL: string;
}

export interface Media {
  type: "link" | "image" | "video";
  url: string;
}
