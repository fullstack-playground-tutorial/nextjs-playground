import React from "react";
import NotificationSkeleton from "@/app/feature/notification/components/NotificationSkeleton";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <div className="relative w-full max-w-md h-full bg-surface-1/80 backdrop-blur-3xl border-l border-white/10 shadow-2xl flex flex-col">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-white/10 rounded-md mb-2"></div>
            <div className="h-3 w-40 bg-white/5 rounded-sm"></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
           <NotificationSkeleton />
        </div>

        <div className="p-4 border-t border-white/5 bg-white/2">
          <div className="w-full h-12 bg-white/5 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
