import {
  SkeletonElement,
  SkeletonWrapper,
} from "@/components/SkeletionLoading";

export default function Loading() {
  return (
    <div className="w-full flex flex-col">
      <div className="p-1 font-semibold text-shadow-2xs mb-2 dark:text-accent-0 w-60 h-10">
        <SkeletonWrapper className="rounded-lg">
          <SkeletonElement width={"100%"} height={"100%"} />
        </SkeletonWrapper>
      </div>
      <SkeletonWrapper className="rounded-lg">
        <SkeletonElement width={"100%"} height={"100vh"} />
      </SkeletonWrapper>
    </div>
  );
}
