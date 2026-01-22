import {
  SkeletonWrapper,
  SkeletonElement,
} from "@/components/SkeletionLoading";

export default function FormLoading() {
  return (
    <div className="flex flex-col items-start max-w-300 gap-4 w-full dark:bg-surface-0 rounded-lg overflow-hidden">
      <SkeletonWrapper className="px-4 pb-6 pt-3 gap-4 flex flex-col">
        <div className="flex flex-row items-center gap-4">
          <SkeletonElement
            width={"80px"}
            height={"40px"}
            borderRadius="8px"
          />
          <SkeletonElement
            width={"200px"}
            height={"40px"}
            borderRadius="8px"
          />
        </div>
        <div className="flex flex-row items-center gap-4">
          <SkeletonElement
            width={"80px"}
            height={"40px"}
            borderRadius="8px"
          />
          <SkeletonElement
            width={"200px"}
            height={"40px"}
            borderRadius="8px"
          />
        </div>
        <div className="flex flex-row items-center gap-4">
          <SkeletonElement
            width={"80px"}
            height={"40px"}
            borderRadius="8px"
          />
          <SkeletonElement
            width={"320px"}
            height={"120px"}
            borderRadius="8px"
          />
        </div>
        <div className="flex flex-row items-center gap-4">
          <SkeletonElement
            width={"80px"}
            height={"40px"}
            borderRadius="8px"
          />
          <SkeletonElement
            width={"100px"}
            height={"40px"}
            borderRadius="8px"
          />
        </div>
        <div className="flex flex-row gap-3 mx-auto pt-2 pb-6 px-8">
          <SkeletonElement
            width={"100px"}
            height={"40px"}
            borderRadius="8px"
          />
          <SkeletonElement
            width={"100px"}
            height={"40px"}
            borderRadius="8px"
          />
        </div>
      </SkeletonWrapper>
    </div>
  );
}
