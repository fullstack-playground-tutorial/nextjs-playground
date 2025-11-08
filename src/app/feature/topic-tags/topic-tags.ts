import { SearchFilter } from "@/app/utils/service";

export interface Tag {
    id: string;
    title: string;
    slug: string;
    description?: string;
    color?: string;
    usageCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
    createdBy?: string;
  }
    
  export interface TagFilter extends SearchFilter{
    name?: string;
    slug?: string;
  }