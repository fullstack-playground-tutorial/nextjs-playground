import {
  SkeletonElement,
  SkeletonWrapper,
} from "@/components/SkeletionLoading";

export default function Loading() {
  return (
    <>
      <div className="p-4 dark:bg-surface-0 h-screen dark:text-primary max-w-300 mx-auto flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 mt-2">
          <h1 className="font-semibold text-accent-0 text-4xl">
            Topic Management
          </h1>
        </div>
        <div className="w-90 h-10">
          <SkeletonWrapper className="rounded-md flex">
            <SkeletonElement width={"100%"} height={"100%"} ></SkeletonElement>
          </SkeletonWrapper>
          </div>

        <div className="grid mt-4 md:mt-6 lg:mt-8 xl:mt-10 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mx-auto">
          <SkeletonWrapper className="xl:w-70 xl:h-85 max-h-85 h-auto md:w-65 w-full rounded-xl">
            <SkeletonElement width={"100%"} height={"100%"}></SkeletonElement>
          </SkeletonWrapper>
          <SkeletonWrapper className="xl:w-70 xl:h-85 max-h-85 h-auto md:w-65 w-full rounded-xl">
            <SkeletonElement width={"100%"} height={"100%"}></SkeletonElement>
          </SkeletonWrapper>
          <SkeletonWrapper className="xl:w-70 xl:h-85 max-h-85 h-auto md:w-65 w-full rounded-xl">
            <SkeletonElement width={"100%"} height={"100%"}></SkeletonElement>
          </SkeletonWrapper>
          <SkeletonWrapper className="xl:w-70 xl:h-85 max-h-85 h-auto md:w-65 w-full rounded-xl">
            <SkeletonElement width={"100%"} height={"100%"}></SkeletonElement>
          </SkeletonWrapper>
          <SkeletonWrapper className="xl:w-70 xl:h-85 max-h-85 h-auto md:w-65 w-full rounded-xl">
            <SkeletonElement width={"100%"} height={"100%"}></SkeletonElement>
          </SkeletonWrapper>
          <SkeletonWrapper className="xl:w-70 xl:h-85 max-h-85 h-auto md:w-65 w-full rounded-xl">
            <SkeletonElement width={"100%"} height={"100%"}></SkeletonElement>
          </SkeletonWrapper>
          <SkeletonWrapper className="xl:w-70 xl:h-85 max-h-85 h-auto md:w-65 w-full rounded-xl">
            <SkeletonElement width={"100%"} height={"100%"}></SkeletonElement>
          </SkeletonWrapper>
          <SkeletonWrapper className="xl:w-70 xl:h-85 max-h-85 h-auto md:w-65 w-full rounded-xl">
            <SkeletonElement width={"100%"} height={"100%"}></SkeletonElement>
          </SkeletonWrapper>
          <SkeletonWrapper className="xl:w-70 xl:h-85 max-h-85 h-auto md:w-65 w-full rounded-xl">
            <SkeletonElement width={"100%"} height={"100%"}></SkeletonElement>
          </SkeletonWrapper>
          <SkeletonWrapper className="xl:w-70 xl:h-85 max-h-85 h-auto md:w-65 w-full rounded-xl">
            <SkeletonElement width={"100%"} height={"100%"}></SkeletonElement>
          </SkeletonWrapper>
          <SkeletonWrapper className="xl:w-70 xl:h-85 max-h-85 h-auto md:w-65 w-full rounded-xl">
            <SkeletonElement width={"100%"} height={"100%"}></SkeletonElement>
          </SkeletonWrapper>
          <SkeletonWrapper className="xl:w-70 xl:h-85 max-h-85 h-auto md:w-65 w-full rounded-xl">
            <SkeletonElement width={"100%"} height={"100%"}></SkeletonElement>
          </SkeletonWrapper>
        </div>
      </div>
    </>
  );
}
