import { loadFlashcardSet } from "@/app/feature/flashcard/action";
import { notFound } from "next/navigation";
import FlashcardRunner from "../../components/FlashcardRunner";

type Props = {
    params: Promise<{ id: string; lang: string }>;
};

export default async function StudyFlashcardPage(props: Props) {
    const { id } = await props.params;

    const flashcardSet = await loadFlashcardSet(id);

    if (!flashcardSet) {
        return notFound();
    }

    return (
        <div className="flex flex-col min-h-screen bg-surface-0">
            <FlashcardRunner set={flashcardSet} />
        </div>
    );
}
