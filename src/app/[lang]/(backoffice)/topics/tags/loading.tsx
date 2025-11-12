import {
  SkeletonElement,
  SkeletonWrapper,
} from "@/components/SkeletionLoading";

export default function Loading() {
  return (
    <>
      <div className="h-screen flex flex-col items-start max-w-300 mx-auto p-4 mt-2">
        <div className="flex flex-col gap-6 w-full">
          <h1 className="font-semibold dark:text-accent-0">Tag Managment</h1>
          <div className="w-90 h-10">
          <SkeletonWrapper className="rounded-md flex">
            <SkeletonElement width={"100%"} height={"100%"} ></SkeletonElement>
          </SkeletonWrapper>
          </div>
        </div>

        <div className="grid mt-4 md:mt-6 lg:mt-8 xl:mt-10 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mx-auto">
          <SkeletonWrapper className="xl:w-70 xl:h-40 max-h-40 h-auto md:w-65 w-full rounded-xl">
            <SkeletonElement width={"100%"} height={"100%"}></SkeletonElement>
          </SkeletonWrapper>
          <SkeletonWrapper className="xl:w-70 xl:h-40 max-h-40 h-auto md:w-65 w-full rounded-xl">
            <SkeletonElement width={"100%"} height={"100%"}></SkeletonElement>
          </SkeletonWrapper>
          <SkeletonWrapper className="xl:w-70 xl:h-40 max-h-40 h-auto md:w-65 w-full rounded-xl">
            <SkeletonElement width={"100%"} height={"100%"}></SkeletonElement>
          </SkeletonWrapper>
          <SkeletonWrapper className="xl:w-70 xl:h-40 max-h-40 h-auto md:w-65 w-full rounded-xl">
            <SkeletonElement width={"100%"} height={"100%"}></SkeletonElement>
          </SkeletonWrapper>
          <SkeletonWrapper className="xl:w-70 xl:h-40 max-h-40 h-auto md:w-65 w-full rounded-xl">
            <SkeletonElement width={"100%"} height={"100%"}></SkeletonElement>
          </SkeletonWrapper>
          <SkeletonWrapper className="xl:w-70 xl:h-40 max-h-40 h-auto md:w-65 w-full rounded-xl">
            <SkeletonElement width={"100%"} height={"100%"}></SkeletonElement>
          </SkeletonWrapper>
          <SkeletonWrapper className="xl:w-70 xl:h-40 max-h-40 h-auto md:w-65 w-full rounded-xl">
            <SkeletonElement width={"100%"} height={"100%"}></SkeletonElement>
          </SkeletonWrapper>
          <SkeletonWrapper className="xl:w-70 xl:h-40 max-h-40 h-auto md:w-65 w-full rounded-xl">
            <SkeletonElement width={"100%"} height={"100%"}></SkeletonElement>
          </SkeletonWrapper>
          <SkeletonWrapper className="xl:w-70 xl:h-40 max-h-40 h-auto md:w-65 w-full rounded-xl">
            <SkeletonElement width={"100%"} height={"100%"}></SkeletonElement>
          </SkeletonWrapper>
          <SkeletonWrapper className="xl:w-70 xl:h-40 max-h-40 h-auto md:w-65 w-full rounded-xl">
            <SkeletonElement width={"100%"} height={"100%"}></SkeletonElement>
          </SkeletonWrapper>
          <SkeletonWrapper className="xl:w-70 xl:h-40 max-h-40 h-auto md:w-65 w-full rounded-xl">
            <SkeletonElement width={"100%"} height={"100%"}></SkeletonElement>
          </SkeletonWrapper>
          <SkeletonWrapper className="xl:w-70 xl:h-40 max-h-40 h-auto md:w-65 w-full rounded-xl">
            <SkeletonElement width={"100%"} height={"100%"}></SkeletonElement>
          </SkeletonWrapper>
        </div>
      </div>
    </>
  );
}
