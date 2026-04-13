"use client";
import React, { useEffect, useState } from "react";
import { Notification } from "../notification";
import SkeletonElement from "@/app/components/SkeletionLoading/SkeletonElement";

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "vừa xong";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
}

export default function NotificationList({ initialNotifications }: { initialNotifications: Notification[] }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/40">
        <svg
          className="w-16 h-16 mb-4 opacity-20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <p className="text-sm font-medium">Bạn chưa có thông báo nào</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="group flex gap-4 p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300 cursor-pointer relative overflow-hidden"
        >
          {/* Unread indicator */}
          {!notif.subscribers[0]?.readed && (
            <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent-0 rounded-full shadow-[0_0_8px_rgba(var(--accent-0-rgb),0.5)]"></div>
          )}

          <div className="relative">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-surface-2 flex-shrink-0">
              <img
                src={notif.requester.avatarURL || `https://ui-avatars.com/api/?name=${notif.requester.name}&background=random`}
                alt={notif.requester.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-surface-1 border border-white/10 flex items-center justify-center text-[10px]">
               {getIconByType(notif.type)}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white/90 mb-0.5 line-clamp-1">
              {notif.title}
            </h4>
            <p className="text-xs text-white/60 line-clamp-2 leading-relaxed mb-1">
              {notif.content}
            </p>
            <span className="text-[10px] font-medium text-white/30 uppercase tracking-wider">
              {formatRelativeTime(notif.createdAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function getIconByType(type: string) {
  switch (type) {
    case "inform": return "📢";
    case "addfriend": return "👤";
    case "accept_add_friend": return "✅";
    case "reject_add_friend": return "❌";
    default: return "🔔";
  }
}
