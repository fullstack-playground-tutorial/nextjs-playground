"use client";

import React, { useState, useTransition } from "react";
import { Thread, Comment, REACTION_TYPES, ReactionType } from "../comment";
import { createComment, createThread, reactionThread } from "../action";
import { User } from "@/app/feature/auth/auth";

const getEmoji = (type: string) => {
  switch (type) {
    case REACTION_TYPES.LIKE:
      return "👍";
    case REACTION_TYPES.LOVE:
      return "❤️";
    case REACTION_TYPES.HAHA:
      return "😂";
    case REACTION_TYPES.WOW:
      return "😮";
    case REACTION_TYPES.SAD:
      return "😢";
    case REACTION_TYPES.ANGRY:
      return "😡";
    default:
      return "✨";
  }
};

interface Props {
  initialThread: Thread | null;
  initialComments: Comment[];
  ownerId: string;
  ownerType: string;
  currentUser?: User;
}

export const ThreadClient = ({
  initialThread,
  initialComments,
  ownerId,
  ownerType,
  currentUser,
}: Props) => {
  const [thread, setThread] = useState<Thread | null>(initialThread);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleCreateThread = () => {
    if (!currentUser) return;
    const threadData: any = {
      content: "Thread for " + ownerId,
      ownerId,
      ownerType,
      userId: currentUser.id,
    };

    startTransition(async () => {
      const result = await createThread(threadData);
      if (result.successMsg) {
        // Reload or update state
        // In a real app, we'd probably fetch the new thread object
      }
    });
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    let targetThreadId = thread?.id;

    if (!targetThreadId) {
      // Logic to create thread first or handled by backend
      return;
    }

    const commentData: any = {
      threadId: targetThreadId,
      userId: currentUser.id,
      content: newComment,
    };

    startTransition(async () => {
      const result = await createComment(commentData);
      if (result.successMsg) {
        setNewComment("");
        // In a real app, we would revalidate or fetch new comments
      }
    });
  };

  const handleReaction = (type: ReactionType) => {
    if (!thread || !currentUser) return;
    startTransition(async () => {
      await reactionThread(thread.id, type, ownerId);
    });
  };

  const avatarDefault = "https://res.cloudinary.com/dw9htagir/image/upload/v1769265769/default-avatar.png";

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-surface-1/50 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300">
      {/* Thread Header */}
      {!thread ? (
        <div className="flex flex-col items-center gap-4 py-8">
          <p className="text-secondary">No conversation started yet.</p>
          <button
            onClick={handleCreateThread}
            disabled={isPending}
            className="px-6 py-2 rounded-full bg-accent-0 text-white font-medium hover:bg-accent-1 transition-colors disabled:opacity-50"
          >
            Start Conversation
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-primary">Discussion</h3>
            <span className="text-sm text-tertiary-0">{thread.replyCount} Comments</span>
          </div>
          
          <div className="flex gap-2">
            {Object.values(REACTION_TYPES).map((type) => (
              <button
                key={type}
                onClick={() => handleReaction(type)}
                className="p-2 rounded-full bg-glass-100 hover:bg-glass-200 transition-all hover:scale-110 active:scale-95 border border-white/5"
              >
                {getEmoji(type)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3 group">
            <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border border-white/20 shadow-lg">
              <img 
                src={avatarDefault} 
                alt="User" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-1 max-w-[85%]">
              <div className="px-4 py-2 rounded-2xl bg-glass-200 border border-t-white/10 border-l-white/10 border-r-transparent border-b-transparent shadow-sm">
                <p className="text-sm font-semibold text-primary mb-0.5">User {comment.userId.substring(0, 4)}</p>
                <p className="text-primary/90 text-[15px] leading-relaxed">{comment.content}</p>
              </div>
              <span className="text-[11px] text-tertiary-1 ml-2">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
        {thread && comments.length === 0 && (
          <p className="text-center text-tertiary-1 my-4 italic">Be the first to comment!</p>
        )}
      </div>

      {/* Add Comment Input */}
      {thread && currentUser && (
        <form onSubmit={handleAddComment} className="flex gap-3 mt-2">
          <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border border-white/10">
            <img 
              src={currentUser.avatarUrl || avatarDefault} 
              alt="Me" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-grow relative group">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full px-5 py-2.5 rounded-full bg-surface-2 border border-white/5 focus:border-accent-0/50 focus:outline-none transition-all placeholder:text-tertiary-1 text-primary shadow-inner"
            />
            <button
              type="submit"
              disabled={isPending || !newComment.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-accent-0 hover:bg-accent-0/10 transition-all disabled:opacity-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
