export default function Loading() {
    return (
        <div className="flex flex-col min-h-screen items-start mx-auto max-w-5xl p-6 animate-pulse">
            {/* Back Button and Title Skeleton */}
            <div className="flex flex-row mt-8 mb-6 items-center gap-4 w-full">
                <div className="rounded-full size-8 bg-surface-2"></div>
                <div className="h-8 w-48 bg-surface-2 rounded-lg"></div>
            </div>

            {/* Main Form Skeleton */}
            <div className="flex flex-col gap-6 w-full bg-white dark:bg-surface-1 p-8 rounded-xl border dark:border-border shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="h-3 w-20 bg-surface-2 rounded"></div>
                        <div className="h-10 w-full bg-surface-2 rounded-lg"></div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="h-3 w-20 bg-surface-2 rounded"></div>
                        <div className="h-10 w-full bg-surface-2 rounded-lg"></div>
                    </div>
                </div>

                {/* Info Section Skeleton */}
                <div className="flex flex-row justify-between items-center py-4 border-y dark:border-border">
                    <div className="flex flex-row gap-4 items-center">
                        <div className="flex flex-col gap-2">
                            <div className="h-2 w-16 bg-surface-2 rounded"></div>
                            <div className="h-6 w-10 bg-surface-2 rounded"></div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="h-2 w-16 bg-surface-2 rounded"></div>
                            <div className="h-6 w-20 bg-surface-2 rounded"></div>
                        </div>
                    </div>
                    <div className="h-8 w-24 bg-surface-2 rounded-full"></div>
                </div>

                {/* Questions Section Skeleton */}
                <div className="flex flex-col gap-6 mt-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex flex-col gap-4 border dark:border-accent-0/30 rounded-xl p-6 bg-accent-0/5">
                            <div className="flex justify-between items-center">
                                <div className="h-5 w-32 bg-surface-2 rounded"></div>
                                <div className="flex gap-4">
                                    <div className="h-6 w-24 bg-surface-2 rounded"></div>
                                    <div className="h-6 w-16 bg-surface-2 rounded"></div>
                                </div>
                            </div>
                            <div className="h-24 w-full bg-surface-2 rounded-lg"></div>
                            <div className="h-20 w-full bg-surface-2 rounded-lg mt-2"></div>
                        </div>
                    ))}
                </div>

                {/* Footer Buttons Skeleton */}
                <div className="flex gap-4 justify-center mt-8 pt-8 border-t dark:border-border">
                    <div className="h-12 w-32 bg-surface-2 rounded-xl"></div>
                    <div className="h-12 w-32 bg-surface-2 rounded-xl"></div>
                </div>
            </div>
        </div>
    );
}
