"use client";

import React, { useState, useTransition } from "react";
import { Thread, Comment, REACTION_TYPES, ReactionType } from "../comment";
import { createComment, createThread, reactionThread, getComments } from "../action";
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

interface ThreadProps {
  initialThreads: Thread[];
  ownerId: string;
  ownerType: string;
  currentUser?: User;
}

const ThreadItem = ({ thread, currentUser, onReaction, onReplyAdded }: { 
  thread: Thread; 
  currentUser?: User; 
  onReaction: (id: string, type: ReactionType) => void;
  onReplyAdded: () => void;
}) => {
  const [replies, setReplies] = useState<Comment[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [isPending, startTransition] = useTransition();

  const avatarDefault = "https://res.cloudinary.com/dw9htagir/image/upload/v1769265769/default-avatar.png";

  const fetchReplies = async () => {
    if (replies.length > 0 && showReplies) {
      setShowReplies(false);
      return;
    }
    
    setLoadingReplies(true);
    const result = await getComments(thread.id);
    if (result.data) {
      setReplies(result.data);
      setShowReplies(true);
    }
    setLoadingReplies(false);
  };

  const handleAddReply = async () => {
    if (!replyContent.trim() || !currentUser) return;

    const commentData: any = {
      threadId: thread.id,
      userId: currentUser.id,
      content: replyContent,
    };

    startTransition(async () => {
      const result = await createComment(commentData);
      if (result.successMsg) {
        setReplyContent("");
        setIsReplying(false);
        // Refresh replies
        const newReplies = await getComments(thread.id);
        if (newReplies.data) setReplies(newReplies.data);
        setShowReplies(true);
        onReplyAdded();
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 p-6 rounded-3xl bg-glass-100 border border-t-white/10 border-l-white/10 border-r-transparent border-b-transparent shadow-2xl group/thread hover:bg-glass-200 transition-all duration-500">
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-2xl overflow-hidden border border-white/20 shadow-lg rotate-1 group-hover/thread:rotate-0 transition-transform duration-500">
          <img src={avatarDefault} alt="User" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-primary">User {thread.userId.substring(0, 5)}</span>
            <span className="text-[10px] uppercase tracking-wider text-tertiary-1">
              {new Date(thread.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-primary/95 text-[16px] leading-[1.6] mb-4">{thread.content}</p>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/10">
              {Object.values(REACTION_TYPES).slice(0, 3).map((type) => (
                <button
                  key={type}
                  onClick={() => onReaction(thread.id, type)}
                  className="hover:scale-125 transition-transform duration-200"
                >
                  <span className="text-sm px-1.5">{getEmoji(type)}</span>
                </button>
              ))}
            </div>
            
            <button 
              onClick={fetchReplies}
              disabled={loadingReplies}
              className="text-xs font-bold text-accent-0/80 hover:text-accent-0 transition-colors flex items-center gap-1.5 uppercase tracking-widest disabled:opacity-50"
            >
              {loadingReplies ? "Loading..." : `${showReplies ? 'Hide' : 'View'} Replies (${thread.replyCount})`}
            </button>

            {currentUser && (
               <button 
                onClick={() => setIsReplying(!isReplying)}
                className="text-xs font-bold text-tertiary-1 hover:text-primary transition-colors uppercase tracking-widest"
              >
                Reply
              </button>
            )}
          </div>

          {/* Reply Form */}
          {isReplying && (
            <div className="mt-6 flex flex-col gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
              <textarea
                autoFocus
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full px-4 py-2.5 rounded-xl bg-surface-2 border border-white/10 focus:border-accent-0/40 focus:outline-none transition-all placeholder:text-tertiary-1 text-sm text-primary min-h-[80px]"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsReplying(false)} className="px-4 py-1.5 rounded-full text-xs font-bold text-tertiary-1">Cancel</button>
                <button
                  disabled={!replyContent.trim() || isPending}
                  onClick={handleAddReply}
                  className="px-5 py-1.5 rounded-full bg-accent-0 text-white text-xs font-bold disabled:opacity-50"
                >
                  Post Reply
                </button>
              </div>
            </div>
          )}

          {/* Replies List */}
          {showReplies && replies.length > 0 && (
            <div className="mt-6 pl-4 border-l-2 border-white/5 flex flex-col gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
              {replies.map((reply) => (
                <div key={reply.id} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border border-white/10">
                    <img src={avatarDefault} alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-1 bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5">
                    <span className="text-[11px] font-bold text-accent-0/70">User {reply.userId.substring(0, 5)}</span>
                    <p className="text-sm text-primary/90 leading-relaxed">{reply.content}</p>
                    <span className="text-[9px] text-tertiary-1 mt-1">{new Date(reply.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ThreadClient = ({
  initialThreads,
  ownerId,
  ownerType,
  currentUser,
}: ThreadProps) => {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [newThreadContent, setNewThreadContent] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadContent.trim() || !currentUser) return;

    const threadData: any = {
      content: newThreadContent,
      ownerId,
      ownerType,
      userId: currentUser.id,
    };

    startTransition(async () => {
      const result = await createThread(threadData);
      if (result.successMsg) {
        setNewThreadContent("");
      }
    });
  };

  const handleReaction = (threadId: string, type: ReactionType) => {
    if (!currentUser) return;
    startTransition(async () => {
      await reactionThread(threadId, type, ownerId);
    });
  };

  const avatarDefault = "https://res.cloudinary.com/dw9htagir/image/upload/v1769265769/default-avatar.png";

  return (
    <div className="flex flex-col gap-8">
      {/* Create New Thread */}
      {currentUser && (
        <form onSubmit={handleCreateThread} className="relative group">
          <div className="flex gap-4 p-4 rounded-3xl bg-surface-1/50 backdrop-blur-xl border border-white/10 shadow-xl">
            <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-accent-0/20">
              <img src={currentUser.avatarUrl || avatarDefault} alt="Me" className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow flex flex-col gap-3">
              <textarea
                value={newThreadContent}
                onChange={(e) => setNewThreadContent(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full px-4 py-3 rounded-2xl bg-surface-2/50 border border-white/5 focus:border-accent-0/30 focus:outline-none placeholder:text-tertiary-1 text-primary min-h-[100px] resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isPending || !newThreadContent.trim()}
                  className="px-6 py-2 rounded-full bg-accent-0 text-white font-bold hover:bg-accent-1 transform hover:scale-105 active:scale-95 transition-all disabled:opacity-30 shadow-lg shadow-accent-0/20"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Threads List */}
      <div className="flex flex-col gap-6">
        {threads.length === 0 ? (
          <div className="text-center py-20 opacity-40 italic">No comments yet.</div>
        ) : (
          threads.map((thread) => (
            <ThreadItem 
              key={thread.id} 
              thread={thread} 
              currentUser={currentUser}
              onReaction={handleReaction}
              onReplyAdded={() => {/* Handle count update if needed */}}
            />
          ))
        )}
      </div>
    </div>
  );
};
