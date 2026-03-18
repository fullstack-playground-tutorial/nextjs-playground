import FlashcardForm from "../components/FlashcardForm";
import BackButton from "../components/BackButton";
import { getLocaleService } from "@/app/utils/resource/locales";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const { localize } = getLocaleService(lang);

    return (
        <div className="flex flex-col min-h-screen items-start mx-auto w-full max-w-5xl p-6">
            <div className="flex flex-row mt-8 mb-6 items-center gap-4 group">
                <BackButton />
                <div className="text-2xl font-semibold dark:text-accent-0">
                    {localize("flashcard_create_title")}
                </div>
            </div>

            <FlashcardForm mode="create" />
        </div>
    );
}
