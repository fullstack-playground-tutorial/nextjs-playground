import React from "react";
import { BreadcrumbLoading } from "../components/Breadcrumb";
import FilmIconRaw from "../../../components/Sidebar/icons/film.svg";
const FilmIcon = FilmIconRaw as React.FC<React.SVGProps<SVGSVGElement>>;

export default function Loading() {
    return (
        <div className="w-full">
            {/* Breadcrumb Loading */}
            <div className="p-1 mb-4">
                <BreadcrumbLoading />
            </div>

            <div className="pb-12">
                {/* Hero Section Skeleton */}
                <div className="relative h-[450px] w-full overflow-hidden bg-surface-1 animate-pulse">
                    <div className="h-full w-full flex items-center justify-center opacity-10">
                        <FilmIcon className="size-32 fill-secondary" />
                    </div>
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-0 via-surface-0/40 to-transparent" />
                </div>

                {/* Content Container */}
                <div className="max-w-7xl mx-auto px-6 -mt-40 relative z-10 flex flex-col lg:flex-row gap-10">
                    {/* Poster Card Skeleton */}
                    <div className="w-full lg:w-80 shrink-0">
                        <div className="relative aspect-[2/3] rounded-3xl overflow-hidden border-4 border-surface-1 bg-surface-2 animate-pulse shadow-2xl">
                            <div className="h-full w-full flex items-center justify-center opacity-20">
                                <FilmIcon className="size-20 fill-secondary" />
                            </div>
                        </div>

                        {/* Metadata Sidebar Skeleton */}
                        <div className="mt-8 space-y-6 bg-surface-1/40 backdrop-blur-md p-6 rounded-3xl border dark:border-border/50 shadow-xl">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <div className="h-3 w-20 bg-accent-0/20 rounded animate-pulse" />
                                    <div className="h-5 w-40 bg-surface-2 rounded animate-pulse" />
                                    {i < 3 && <div className="h-px bg-border/20 w-full mt-2" />}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Details Skeleton */}
                    <div className="flex-1 lg:pt-14">
                        <div className="mb-8">
                            <div className="h-16 w-3/4 bg-surface-2 rounded-2xl animate-pulse mb-4" />
                            <div className="h-8 w-1/2 bg-accent-0/10 rounded-xl animate-pulse" />
                        </div>

                        {/* Genres Skeleton */}
                        <div className="flex flex-wrap gap-2.5 mb-10">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-10 w-24 bg-white/5 rounded-xl border dark:border-white/10 animate-pulse" />
                            ))}
                        </div>

                        {/* Description Skeleton */}
                        <div className="bg-surface-1/20 rounded-[2rem] p-10 border dark:border-white/5 backdrop-blur-md mb-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-2 h-8 bg-accent-0/40 rounded-full" />
                                <div className="h-8 w-32 bg-surface-2 rounded-lg animate-pulse" />
                            </div>
                            <div className="space-y-3">
                                <div className="h-5 w-full bg-surface-2/60 rounded animate-pulse" />
                                <div className="h-5 w-[95%] bg-surface-2/60 rounded animate-pulse" />
                                <div className="h-5 w-[90%] bg-surface-2/60 rounded animate-pulse" />
                                <div className="h-5 w-[85%] bg-surface-2/60 rounded animate-pulse" />
                            </div>
                        </div>

                        {/* Episodes Section Skeleton */}
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-2 h-8 bg-accent-0/40 rounded-full" />
                                <div className="h-8 w-48 bg-surface-2 rounded-lg animate-pulse" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex flex-col bg-surface-1/40 rounded-2xl overflow-hidden border border-white/5">
                                        <div className="aspect-video bg-surface-2 animate-pulse" />
                                        <div className="p-4 space-y-2">
                                            <div className="h-5 w-3/4 bg-surface-2 rounded animate-pulse" />
                                            <div className="h-4 w-1/2 bg-surface-2/60 rounded animate-pulse" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}