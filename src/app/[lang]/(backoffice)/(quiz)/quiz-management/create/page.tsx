"use client";

import React, { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useParams } from "next/navigation";
import BackArrow from "@/app/assets/images/icons/back_arrow.svg";
import type { Quiz, Question } from "@/app/feature/quiz";
import { createQuiz } from "@/app/feature/quiz/action";
import useToast from "@/app/components/Toast";

type InternalState = {
  mode: "create" | "edit" | "view" | "review";
  quiz: Quiz;
  editPointOn: boolean;
  editTimeOn: boolean;
};

export default function Page() {
  const [state, setState] = useState<InternalState>({
    quiz: {
      questions: [],
      point: 10,
      timeout: 60 * 60,
      title: "",
      description: "",
      id: crypto.randomUUID(),
    },
    mode: "create",
    editPointOn: false,
    editTimeOn: false,
  });

  const params = useParams();
  const id = params?.id as string | undefined;
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  const handleAddChoice = (e: React.MouseEvent, questionId: string) => {
    e.preventDefault();
    const idx = state.quiz.questions.findIndex((it) => it.id == questionId);
    const newQuestions = [...state.quiz.questions];
    newQuestions[idx].choices.push({
      id: (newQuestions[idx].choices.length + 1).toString(),
      content: "",
    });

    setState((prev) => ({
      ...prev,
      quiz: {
        ...prev.quiz,
        questions: [...newQuestions],
      },
    }));
  };

  const handleAddQuestion = (e: React.MouseEvent) => {
    e.preventDefault();
    setState((prev) => ({
      ...prev,
      quiz: {
        ...prev.quiz,
        questions: [
          ...prev.quiz.questions,
          {
            id: (prev.quiz.questions.length + 1).toString(),
            question: "",
            choices: [],
            answers: [],
            point: 0,
            status: "draft",
          } as Question,
        ],
      },
    }));
  };

  useEffect(() => {
    if (id) {
      if (pathname.endsWith(id)) {
        setState((prev) => ({ ...prev, mode: "view" }));
      } else if (pathname.endsWith(id + "/edit")) {
        setState((prev) => ({ ...prev, mode: "edit" }));
      } else if (pathname.endsWith(id + "/review")) {
        setState((prev) => ({ ...prev, mode: "review" }));
      } else {
        router.push("/");
      }
    }
  }, [id, pathname, router]);

  const handleDeleteQuestion = (e: React.MouseEvent, questionId: string) => {
    e.preventDefault();
    const newQuestions = state.quiz.questions.filter((i) => i.id != questionId);
    setState((prev) => ({
      ...prev,
      quiz: { ...prev.quiz, questions: newQuestions },
    }));
  };

  const toggleAnswer = (
    e: React.ChangeEvent<HTMLInputElement>,
    questionId: string,
    choiceId: string,
  ) => {
    const newQuestions = [...state.quiz.questions];
    const idx = newQuestions.findIndex((i) => i.id == questionId);
    const answerIdx = newQuestions[idx].answers.indexOf(choiceId);

    if (answerIdx >= 0) {
      newQuestions[idx].answers = newQuestions[idx].answers.filter(
        (i) => i != choiceId,
      );
    } else {
      newQuestions[idx].answers.push(choiceId);
    }

    setState((prev) => ({
      ...prev,
      quiz: { ...prev.quiz, questions: newQuestions },
    }));
  };

  const handleChangeQuestion = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    id: string,
  ) => {
    const copy = [...state.quiz.questions];
    const quizIdx = copy.findIndex((i) => i.id === id);
    copy[quizIdx].question = e.target.value;

    setState((prev) => ({ ...prev, quiz: { ...prev.quiz, questions: copy } }));
  };

  const handleChangeQuestionPoint = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => {
    const point = Number.parseFloat(e.target.value);
    if (Number.isNaN(point)) {
      return;
    }

    const copy = [...state.quiz.questions];
    const quizIdx = copy.findIndex((i) => i.id === id);
    copy[quizIdx].point = point;
    setState((prev) => ({ ...prev, quiz: { ...prev.quiz, questions: copy } }));
  };

  const handleChangeChoice = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    qId: string,
    id: string,
  ) => {
    const copy = [...state.quiz.questions];
    const quizIdx = copy.findIndex((i) => i.id === qId);
    const cIdx = copy[quizIdx].choices.findIndex((i) => i.id == id);
    copy[quizIdx].choices[cIdx].content = e.target.value;
    setState((prev) => ({ ...prev, quiz: { ...prev.quiz, questions: copy } }));
  };

  const handleDeleteChoice = (
    e: React.MouseEvent,
    questionId: string,
    choiceId: string,
  ) => {
    e.preventDefault();
    const newQuestions = [...state.quiz.questions];
    const idx = newQuestions.findIndex((i) => i.id == questionId);
    const newChoicesOfQuestion = newQuestions[idx].choices.filter(
      (i) => i.id != choiceId,
    );
    newQuestions[idx].choices = newChoicesOfQuestion;
    setState((prev) => ({
      ...prev,
      quiz: { ...prev.quiz, questions: newQuestions },
    }));
  };

  const handleSaveQuestion = (e: React.MouseEvent, questionId: string) => {
    e.preventDefault();
    const newQuestions = [...state.quiz.questions];
    const idx = newQuestions.findIndex((i) => i.id == questionId);
    newQuestions[idx].status = "done";
    setState((prev) => ({
      ...prev,
      quiz: { ...prev.quiz, questions: newQuestions },
    }));
  };

  const handleChangeQuizPoint = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const newPoint = parseFloat(val);
    if (!Number.isNaN(newPoint)) {
      setState((prev) => ({
        ...prev,
        quiz: { ...prev.quiz, point: newPoint },
      }));
    }
  };

  const handleChangeQuizTimeout = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const newTimeout = parseFloat(val);
    if (!Number.isNaN(newTimeout)) {
      setState((prev) => ({
        ...prev,
        quiz: { ...prev.quiz, timeout: newTimeout },
      }));
    }
  };

  const handleCreate = async (e: React.MouseEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createQuiz(state.quiz);
      if (res.error) {
        toast.addToast("error", res.error);
      } else {
        toast.addToast(
          "success",
          res.successMsg || "Successfully created new test",
        );
        router.back();
      }
    });
  };

  const currentPoint = useMemo(() => {
    let newQuizPoint = 0;
    state.quiz.questions.forEach((v) => {
      newQuizPoint = newQuizPoint + v.point;
    });
    return newQuizPoint;
  }, [state.quiz.questions]);

  const { mode, quiz } = state;

  return (
    <div className="flex flex-col min-h-screen items-start mx-auto max-w-5xl p-6">
      <div className="flex flex-row mt-8 mb-6 items-center gap-4 group">
        <div
          className="rounded-full shadow size-8 flex items-center justify-center p-2 dark:bg-surface-2 transition cursor-pointer group-hover:dark:bg-orange-500"
          onClick={() => router.back()}
        >
          <BackArrow className="hover:underline group-hover:dark:fill-primary dark:fill-accent-0" />
        </div>

        <div className="text-2xl font-semibold dark:text-accent-0">
          {mode === "create"
            ? "Create New Quiz"
            : mode === "edit"
              ? "Edit Quiz"
              : mode === "view"
                ? "Quiz Review"
                : "View Quiz"}
        </div>
      </div>

      <form className="flex flex-col gap-6 w-full bg-white dark:bg-surface-1 p-8 rounded-xl border dark:border-border shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider">
              Quiz Title
            </label>
            <input
              type="text"
              placeholder="Enter quiz title..."
              className="px-4 py-2 rounded-lg border dark:border-border dark:bg-surface-0 outline-none focus:border-accent-0 transition-colors"
              onChange={(e) =>
                setState({
                  ...state,
                  quiz: { ...state.quiz, title: e.target.value },
                })
              }
              value={state.quiz.title}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider">
              Description
            </label>
            <input
              type="text"
              placeholder="Brief description..."
              className="px-4 py-2 rounded-lg border dark:border-border dark:bg-surface-0 outline-none focus:border-accent-0 transition-colors"
              onChange={(e) =>
                setState({
                  ...state,
                  quiz: { ...state.quiz, description: e.target.value },
                })
              }
              value={state.quiz.description || ""}
            />
          </div>
        </div>

        <div className="flex flex-row justify-between items-center py-4 border-y dark:border-border">
          <div className="flex flex-row gap-4 items-center">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-secondary uppercase">
                Points Required
              </label>
              <div className="flex items-center gap-2">
                <span className="font-bold dark:text-primary">
                  {currentPoint} /
                </span>
                <input
                  type="number"
                  className="w-16 px-2 py-1 rounded bg-transparent border-b border-accent-0/30 focus:border-accent-0 outline-none text-center font-bold"
                  value={quiz.point}
                  onChange={handleChangeQuizPoint}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-secondary uppercase">
                Time (Seconds)
              </label>
              <input
                type="number"
                className="w-24 px-2 py-1 rounded bg-transparent border-b border-accent-0/30 focus:border-accent-0 outline-none text-center font-bold"
                value={quiz.timeout}
                onChange={handleChangeQuizTimeout}
              />
            </div>
          </div>
          <div className="px-4 py-2 bg-accent-0/10 rounded-full">
            <span className="text-sm font-bold text-accent-0">
              {quiz.questions.length} Questions
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6 mt-4">
          {quiz.questions.map((item) =>
            item.status === "draft" ? (
              <div
                key={item.id}
                className="flex flex-col gap-4 border dark:border-accent-0/30 rounded-xl p-6 bg-accent-0/5"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-accent-0">
                    Question #{item.id}
                  </h4>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-secondary">
                      Points:
                    </label>
                    <input
                      type="number"
                      className="w-16 px-2 py-1 rounded border dark:border-border dark:bg-surface-0 outline-none"
                      value={item.point}
                      onChange={(e) => handleChangeQuestionPoint(e, item.id)}
                    />
                  </div>
                </div>

                <textarea
                  placeholder="Type your question here..."
                  value={item.question}
                  onChange={(e) => handleChangeQuestion(e, item.id)}
                  className="w-full min-h-[100px] px-4 py-3 rounded-lg border dark:border-border dark:bg-surface-0 outline-none focus:border-accent-0 transition-colors resize-none"
                />

                <div className="space-y-3">
                  <label className="text-xs font-bold text-secondary uppercase">
                    Choices
                  </label>
                  {item.choices.map((c) => (
                    <div key={c.id} className="flex gap-3 items-center">
                      <input
                        type="checkbox"
                        className="size-5 accent-accent-0 shrink-0"
                        checked={item.answers.includes(c.id)}
                        onChange={(e) => toggleAnswer(e, item.id, c.id)}
                      />
                      <textarea
                        placeholder="Choice content..."
                        value={c.content}
                        onChange={(e) => handleChangeChoice(e, item.id, c.id)}
                        className="flex-1 min-h-[40px] px-4 py-2 rounded-lg border dark:border-border dark:bg-surface-0 outline-none focus:border-accent-0 transition-colors resize-none text-sm"
                      />
                      <button
                        type="button"
                        className="p-2 transition-colors hover:text-red-500"
                        onClick={(e) => handleDeleteChoice(e, item.id, c.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="text-sm font-bold text-accent-0 hover:underline px-2"
                    onClick={(e) => handleAddChoice(e, item.id)}
                  >
                    + Add Choice
                  </button>
                </div>

                <div className="flex gap-3 self-end mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg border border-accent-0 text-accent-0 hover:bg-accent-0 hover:text-white transition-colors text-sm font-bold"
                    onClick={(e) => handleSaveQuestion(e, item.id)}
                  >
                    Confirm Question
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg text-secondary hover:text-red-500 transition-colors text-sm font-bold"
                    onClick={(e) => handleDeleteQuestion(e, item.id)}
                  >
                    Discard
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={item.id}
                className="flex flex-col gap-3 p-6 rounded-xl border dark:border-border hover:border-accent-0/50 transition-colors"
                onClick={() => {
                  // Optional: allow re-editing by clicking
                  const newQuestions = [...quiz.questions];
                  const idx = newQuestions.findIndex((q) => q.id === item.id);
                  newQuestions[idx].status = "draft";
                  setState((prev) => ({
                    ...prev,
                    quiz: { ...prev.quiz, questions: newQuestions },
                  }));
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-secondary uppercase">
                    Question #{item.id} • {item.point} Points
                  </span>
                </div>
                <p className="font-semibold dark:text-primary">
                  {item.question}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.choices.map((c) => (
                    <div
                      key={c.id}
                      className={`px-3 py-1 rounded-full text-xs border ${item.answers.includes(c.id) ? "border-accent-0 bg-accent-0/10 text-accent-0" : "border-border text-secondary"}`}
                    >
                      {c.content}
                    </div>
                  ))}
                </div>
              </div>
            ),
          )}

          <button
            type="button"
            onClick={(e) => handleAddQuestion(e)}
            className="w-full py-4 rounded-xl border-2 border-dashed border-border hover:border-accent-0 hover:bg-accent-0/5 transition-all text-secondary hover:text-accent-0 font-bold"
          >
            + Add New Question
          </button>
        </div>

        <div className="flex gap-4 justify-center mt-8 pt-8 border-t dark:border-border">
          <button
            type="button"
            className="px-8 py-3 rounded-xl border border-border text-secondary hover:bg-gray-50 dark:hover:bg-surface-0 transition-colors font-bold"
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isPending}
            className="px-8 py-3 rounded-xl bg-accent-0 hover:bg-accent-1 text-white shadow-lg shadow-accent-0/20 transition-all font-bold disabled:opacity-50"
            onClick={handleCreate}
          >
            {isPending ? "Creating..." : "Save Quiz"}
          </button>
        </div>
      </form>
    </div>
  );
}
