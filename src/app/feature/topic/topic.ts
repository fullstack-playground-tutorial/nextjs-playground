import { SearchFilter } from "@/app/utils/service";
import { Tag } from "../topic-tags";

export interface Topic {
    id: string;
    title: string;
    slug: string;
    summary: string;
    authorName?: string;
    authorId?: string;
    tags: Tag[]; // tags for search
    thumbnailUrl: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
    publishedAt?: Date;
    status?: TopicStatus;
    views?: number;
    likes?: number;
    commentCount?: number;
  
    // SEO
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  }

  export interface TopicFilter extends  SearchFilter {

  }
  
  export interface TopicFilter {}
  
  export type TopicStatus = "submit" | "draft" | "approve" | "reject";
  export type ActionProperites = {
    key: TopicStatus;
    label: string;
    waitingLabel: string;
    className: string;
    onClick?: () => void;
  };
  