import QuizCreateForm from "./components/QuizCreateForm";
import BackButton from "./components/BackButton";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen items-start mx-auto max-w-5xl p-6">
      <div className="flex flex-row mt-8 mb-6 items-center gap-4 group">
        <BackButton />
        <div className="text-2xl font-semibold dark:text-accent-0">
          Create New Quiz
        </div>
      </div>

      <QuizCreateForm />
    </div>
  );
}
