import React from "react";
import SkeletonElement from "@/app/components/SkeletionLoading/SkeletonElement";

export default function NotificationSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
          <SkeletonElement width="48px" height="48px" borderRadius="12px" />
          <div className="flex-1 flex flex-col gap-2">
            <SkeletonElement width="40%" height="16px" borderRadius="4px" />
            <SkeletonElement width="80%" height="12px" borderRadius="4px" />
            <SkeletonElement width="20%" height="10px" borderRadius="4px" />
          </div>
        </div>
      ))}
    </div>
  );
}
