import {
  SkeletonElement,
  SkeletonWrapper,
} from "@/components/SkeletionLoading";
import FilmIcon from "../../components/Sidebar/icons/film.svg";

export default function Loading() {
  return (
    <div className="p-4 dark:bg-surface-0 h-screen dark:text-primary max-w-300 mx-auto flex flex-col">
      <div className="flex flex-row items-center">
        {/* Topbar */}
        <div className="flex flex-row justify-start items-center gap-2 w-full">
          <FilmIcon className="dark:fill-accent-0 mt-2 items-stretch size-20" />

          <h1 className="font-semibold underline underline-offset-10 dark:text-accent-0 text-5xl text-shadow-lg/50">
            CINEMATIC
          </h1>
        </div>
        <div className="self-end mb-4 h-8 w-70">
          <SkeletonWrapper className="rounded-lg">
            <SkeletonElement width={"100%"} height={"100%"} />
          </SkeletonWrapper>
        </div>
      </div>
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
