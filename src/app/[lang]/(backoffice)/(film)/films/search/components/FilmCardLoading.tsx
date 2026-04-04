import { SkeletonElement } from "@/components/SkeletionLoading";

export const SkeletonFilmCard = () => (
    <div className="flex flex-col gap-3">
        <SkeletonElement width="100%" height="auto" className="aspect-[2/3] rounded-2xl" />
        <div className="flex flex-col gap-2 px-1">
            <SkeletonElement width="80%" height="20px" className="rounded-md" />
            <SkeletonElement width="50%" height="14px" className="rounded-md" />
        </div>
    </div>
);