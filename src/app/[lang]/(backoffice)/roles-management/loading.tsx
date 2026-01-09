import {
  SkeletonElement,
  SkeletonWrapper,
} from "@/components/SkeletionLoading";
import React from "react";

export default function Loading() {
  return (
    <div className="p-4 dark:bg-surface-0 h-screen dark:text-primary max-w-300 mx-auto flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 mt-2">
        <h1 className="font-semibold text-accent-0 text-4xl">
          Role Management
        </h1>
      </div>
      <div className="mt-4 md:mt-6 lg:mt-8 xl:mt-10 mx-auto flex flex-col gap-4 justify-center items-start w-full h-full">
        <div className="w-16 h-9">
          <SkeletonWrapper className="overflow-hidden rounded-md">
            <SkeletonElement width="100%" height="100%" />
          </SkeletonWrapper>
        </div>

        <div className="w-full max-w-300 h-[calc(100vh-20%)] rounded-lg overflow-hidden">
          <SkeletonWrapper>
            <SkeletonElement width="100%" height="100%" />
          </SkeletonWrapper>
        </div>
      </div>
    </div>
  );
}
