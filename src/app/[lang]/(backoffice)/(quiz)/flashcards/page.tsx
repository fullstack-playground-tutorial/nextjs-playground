import { getLocaleService } from "@/app/utils/resource/locales";
import Link from "next/link";
import { getFlashcardSets } from "@/app/feature/flashcard/action";
import { FlashcardSet } from "@/app/feature/flashcard/flashcard";

export default async function FlashcardPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const { localize } = getLocaleService(lang);
    const flashcardSets = await getFlashcardSets() as FlashcardSet[];

    return (
        <div className="flex flex-col min-h-screen items-start mx-auto w-full max-w-5xl p-6">
            <div className="flex flex-row mt-8 mb-8 items-center justify-between w-full">
                <div>
                    <h1 className="text-3xl font-bold dark:text-accent-0 tracking-tight">
                        {localize("flashcard_management_title")}
                    </h1>
                    <p className="text-secondary mt-1">
                        Manage and review your study materials
                    </p>
                </div>
                <Link
                    href={`/${lang}/flashcards/create`}
                    className="btn btn-md dark:bg-accent-0 hover:dark:bg-accent-1 dark:text-primary font-bold transition-all shadow-lg hover:shadow-accent-0/20"
                >
                    <span className="text-lg">+</span> {localize("flashcard_create_title")}
                </Link>
            </div>

            {flashcardSets && flashcardSets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {flashcardSets.map((set) => (
                        <div 
                            key={set.id} 
                            className="group flex flex-col p-6 rounded-2xl bg-surface-1/50 border border-border hover:border-accent-0/50 transition-all hover:shadow-xl hover:shadow-accent-0/5"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 rounded-lg bg-accent-0/10 text-accent-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>
                                </div>
                                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-surface-2 text-secondary">
                                    {set.cards?.length || 0} cards
                                </span>
                            </div>
                            
                            <Link href={`/${lang}/flashcards/${set.id}`}>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-accent-0 transition-colors truncate">
                                    {set.name}
                                </h3>
                            </Link>
                            <p className="text-secondary text-sm mb-6 line-clamp-2 h-10">
                                {set.description || "No description provided."}
                            </p>
                            
                            <div className="mt-auto flex gap-3">
                                <Link
                                    href={`/${lang}/flashcards/${set.id}/study`}
                                    className="flex-1 btn btn-sm dark:bg-accent-0 dark:text-primary font-bold"
                                >
                                    Study Now
                                </Link>
                                <Link
                                    href={`/${lang}/flashcards/${set.id}/edit`}
                                    className="btn btn-sm btn-ghost border border-border hover:border-accent-0"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-full p-20 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl bg-surface-1/30">
                    <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mb-4 text-secondary/50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                    </div>
                    <p className="text-xl font-semibold mb-2">No flashcard sets yet</p>
                    <p className="text-secondary text-center max-w-xs mb-8">
                        Create your first study set to start learning more efficiently with spaced repetition.
                    </p>
                    <Link
                        href={`/${lang}/flashcards/create`}
                        className="btn dark:bg-accent-0 dark:text-primary font-bold px-8"
                    >
                        + Create First Set
                    </Link>
                </div>
            )}
        </div>
    );
}