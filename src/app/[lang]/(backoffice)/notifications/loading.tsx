import React from "react";
import NotificationSkeleton from "@/app/feature/notification/components/NotificationSkeleton";

export default function Loading() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 animate-pulse">
          <div className="h-10 w-64 bg-white/10 rounded-lg mb-4"></div>
          <div className="h-1 w-20 bg-accent-0/40 rounded-full"></div>
        </header>

        <section className="bg-surface-1/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
            <div className="h-6 w-24 bg-white/10 rounded-md"></div>
            <div className="h-8 w-40 bg-accent-0/10 rounded-full"></div>
          </div>
          
          <NotificationSkeleton />
        </section>
      </div>
    </main>
  );
}
