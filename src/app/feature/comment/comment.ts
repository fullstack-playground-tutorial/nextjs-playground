export type Thread = {
  id: string;
  content: string;
  ownerId: string;
  ownerType: string;
  userId: string;
  replyCount: number;
  createdAt: string;
  updatedAt: string;
};

export type Comment = {
  id: string;
  threadId: string;
  parentId?: string;
  userId: string;
  content: string;
  mentionUserIds?: string[];
  createdAt: string;
  updatedAt: string;
};

export const REACTION_TYPES = {
  LIKE: "like",
  UNLIKE: "unlike",
  LOVE: "love",
  HAHA: "haha",
  WOW: "wow",
  SAD: "sad",
  ANGRY: "angry",
} as const;

export type ReactionType = (typeof REACTION_TYPES)[keyof typeof REACTION_TYPES];
