import {
  SkeletonElement,
  SkeletonWrapper,
} from "@/components/SkeletionLoading";
import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col h-screen items-start mx-auto max-w-300 p-6">
      <div className="flex flex-row mt-8 mb-6 items-center gap-4 group">
        <div className="rounded-full shadow size-8 flex items-center justify-center p-2 dark:bg-surface-2 transition cursor-pointer  group-hover:dark:bg-orange-500">
          <SkeletonWrapper className="rounded-md">
            <SkeletonElement width="240px" height="100%" />
          </SkeletonWrapper>
        </div>
      </div>

      <form className="flex flex-col gap-4 w-full">
        <div className="flex flex-row flex-wrap mb-4 gap-4">
          <div className="flex flex-col items-start flex-1 min-w-0">
            <div className="w-full h-12">
              <SkeletonWrapper className="rounded-md">
                <SkeletonElement width="100%" height="100%" />
              </SkeletonWrapper>
            </div>
          </div>
          <div
            className={`text-xs text-tertiary-0 w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-start mt-2 `}
          >
              <span className="font-bold text-secondary shrink-0">
                Topic URL:
              </span>{" "}
              <div className="underline cursor-pointer italic overflow-hidden text-ellipsis whitespace-nowrap">
                <span>{"https://example/some-thing-like-this</span"}</span>
              </div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-4 flex-1 focus-within:[&>label]:dark:text-accent-0 h-12">
          <div className="w-full h-12">
            <SkeletonWrapper className="rounded-md">
              <SkeletonElement width="100%" height="100%" />
            </SkeletonWrapper>
          </div>
        </div>
        <div className="w-full h-30 mb-4">
          <SkeletonWrapper className="rounded-md">
            <SkeletonElement width="100%" height="100%" />
          </SkeletonWrapper>
        </div>
        <div className="w-full min-h-80 rounded-lg overflow-hidden">
          <SkeletonWrapper className="rounded-lg w-full">
            <SkeletonElement width="100%" height="100%" />
          </SkeletonWrapper>
        </div>
        <div className="mx-auto mt-6 mb-4 flex flex-row gap-3">
          <div className="mx-auto mt-6 mb-4 flex flex-row gap-3">
            <SkeletonWrapper className="rounded-md">
              <SkeletonElement width="80px" height="40px" />
            </SkeletonWrapper>
            <SkeletonWrapper className="rounded-md">
              <SkeletonElement width="80px" height="40px" />
            </SkeletonWrapper>
            <SkeletonWrapper className="rounded-md">
              <SkeletonElement width="80px" height="40px" />
            </SkeletonWrapper>
          </div>
        </div>
      </form>
    </div>
  );
}
