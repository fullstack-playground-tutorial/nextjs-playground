import { loadFlashcardSet } from "@/app/feature/flashcard/action";
import { notFound } from "next/navigation";
import FlashcardForm from "../../components/FlashcardForm";
import BackButton from "../../components/BackButton";

type Props = {
    params: Promise<{ id: string; lang: string }>;
};

export default async function EditFlashcardPage(props: Props) {
    const { id, lang } = await props.params;

    const flashcardSetPromise = loadFlashcardSet(id);
    const flashcardSet = await flashcardSetPromise;

    if (!flashcardSet) {
        return notFound();
    }

    return (
        <div className="flex flex-col min-h-screen items-start mx-auto w-full max-w-5xl p-6">
            <div className="mt-8 mb-6 flex items-center gap-4">
                <BackButton />
                <h1 className="text-3xl font-bold dark:text-accent-0 tracking-tight">
                    Edit Flashcard Set
                </h1>
            </div>

            <FlashcardForm
                mode="edit"
                fetchedSetPromise={flashcardSetPromise}
            />
        </div>
    );
}
