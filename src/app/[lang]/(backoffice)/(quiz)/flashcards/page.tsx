"use server";
import { getLocaleService } from "@/app/utils/resource/locales";
import Link from "next/link";

export default async function FlashcardPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const { localize } = getLocaleService(lang);

    return (
        <div className="flex flex-col min-h-screen items-start mx-auto w-full max-w-5xl p-6">
            <div className="flex flex-row mt-8 mb-6 items-center justify-between w-full">
                <div className="text-2xl font-semibold dark:text-accent-0">
                    {localize("flashcard_management_title")}
                </div>
                <Link
                    href={`/${lang}/flashcards/create`}
                    className="btn btn-sm dark:bg-accent-0 hover:dark:bg-accent-1 dark:text-primary font-bold transition-all"
                >
                    + {localize("flashcard_create_title")}
                </Link>
            </div>
            {/* List of flashcard sets would go here */}
            <div className="w-full p-12 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl bg-surface-1/50">
                <p className="text-secondary font-medium">No flashcard sets yet. Create your first one!</p>
            </div>
        </div>
    );
}