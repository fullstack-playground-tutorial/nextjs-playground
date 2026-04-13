"use client";
import React from "react";
import { useRouter } from "next/navigation";
import NotificationList from "./NotificationList";
import { Notification } from "../notification";

export default function NotificationDrawer({ initialNotifications }: { initialNotifications: Notification[] }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Sidebar background overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={() => router.back()} 
      />
      
      {/* Sidebar content */}
      <div className="relative w-full max-w-md h-full bg-surface-1/80 backdrop-blur-3xl border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent uppercase tracking-tighter">
              Thông báo
            </h2>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mt-1">
              Trung tâm hoạt động
            </p>
          </div>
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all group"
          >
            <svg className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* List content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
           <NotificationList initialNotifications={initialNotifications} />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-white/2">
          <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white/60 hover:text-white transition-all uppercase tracking-widest">
            Đánh dấu tất cả là đã đọc
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
