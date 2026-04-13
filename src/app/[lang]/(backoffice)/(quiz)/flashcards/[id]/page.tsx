import { loadFlashcardSet } from "@/app/feature/flashcard/action";
import { notFound } from "next/navigation";
import Link from "next/link";
import FlashcardForm from "../components/FlashcardForm";
import BackButton from "../components/BackButton";

type Props = {
    params: Promise<{ id: string; lang: string }>;
};

export default async function ViewFlashcardPage(props: Props) {
    const { id, lang } = await props.params;

    const flashcardSetPromise = loadFlashcardSet(id);
    const flashcardSet = await flashcardSetPromise;

    if (!flashcardSet) {
        return notFound();
    }

    return (
        <div className="flex flex-col min-h-screen items-start mx-auto w-full max-w-5xl p-6">
            <div className="mt-8 mb-6 flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                    <BackButton />
                    <h1 className="text-3xl font-bold dark:text-accent-0 tracking-tight">
                        View Flashcard Set
                    </h1>
                </div>
                <Link
                    href={`/${lang}/flashcards/${id}/study`}
                    className="btn btn-md bg-accent-0 text-white font-bold rounded-xl shadow-lg hover:bg-accent-1"
                >
                    Study Now
                </Link>
            </div>

            <FlashcardForm
                mode="view"
                fetchedSetPromise={flashcardSetPromise}
            />
        </div>
    );
}
