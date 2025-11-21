import { SearchFilter } from "@/app/utils/service";
import { Tag } from "../topic-tags";
import { ActionStatus } from "@/app/[lang]/(backoffice)/components/ActionButtons/ActionButtons";

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
  status?: ActionStatus;
  views?: number;
  likes?: number;
  commentCount?: number;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface TopicFilter extends SearchFilter {}
