import { getQuizService } from "@/app/core/server/context";
import BackButton from "../components/BackButton";
import QuizForm from "../components/QuizForm";

type Props = {
    params: Promise<{ id: string }>;
};
export default async function Page(props: Props) {
    const params = await props.params;
    const id = params.id;
    const quiz = getQuizService().load(id);
    return <div className="flex flex-col min-h-screen items-start mx-auto max-w-5xl p-6">
        <div className="flex flex-row mt-8 mb-6 items-center gap-4 group">
            <BackButton />
            <div className="text-2xl font-semibold dark:text-accent-0">
                Quiz Details
            </div>
        </div>
        <QuizForm mode="view" fetchedQuizPromise={quiz} />
    </div>;
}