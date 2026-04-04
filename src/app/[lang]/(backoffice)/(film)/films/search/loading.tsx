import { SkeletonFilmCard } from "./components/FilmCardLoading";

export default function Loading() {
    return (

        <div className="w-full space-y-10 py-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
                {Array.from({ length: 12 }).map((_, i) => (
                    <SkeletonFilmCard key={i} />
                ))}
            </div>
        </div>
    );
}