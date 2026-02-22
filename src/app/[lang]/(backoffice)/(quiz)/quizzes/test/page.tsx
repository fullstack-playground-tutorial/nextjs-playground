"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useRouter, useParams } from "next/navigation";
import { getQuiz } from "@/app/feature/quiz/action";
import type { Quiz } from "@/app/feature/quiz";
import useToast from "@/app/components/Toast";
import BackArrow from "@/app/assets/images/icons/back_arrow.svg";

type Answer = {
  choices: string[]; // choice ids
};

export default function QuizTest() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [quiz, setQuiz] = useState<Quiz>();
  const [answerSheet, setAnswerSheet] = useState<Answer[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  const toggleChoice = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ) => {
    const newAnswerSheet = [...answerSheet];
    if (e.target.checked) {
      newAnswerSheet[idx].choices.push(e.target.value);
    } else {
      newAnswerSheet[idx].choices = newAnswerSheet[idx].choices.filter(
        (it) => it !== e.target.value,
      );
    }
    setAnswerSheet(newAnswerSheet);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let score = 0;
    let notFillAlert = false;

    if (!quiz) return;

    const correctSheet = quiz.questions.map((it) => ({ choices: it.answers }));

    answerSheet.forEach((it, idx) => {
      if (it.choices.length === 0) {
        notFillAlert = true;
      }
      const correctSet = new Set(correctSheet[idx].choices);
      const userSet = new Set(it.choices);

      // Check if user's choices match correct answers exactly
      const isCorrect =
        correctSet.size === userSet.size &&
        [...correctSet].every((val) => userSet.has(val));

      if (isCorrect) {
        score += quiz.questions[idx].point || 0;
      }
    });

    if (notFillAlert) {
      setShowAlert(true);
      toast.addToast("error", "Please answer all questions before submitting.");
    } else {
      toast.addToast(
        "success",
        `Quiz submitted! Your score: ${score}/${quiz.point}`,
      );
      // Typically you'd navigate or show a result modal here
    }
  };

  const isChecked = (idx: number, v: string) => {
    return answerSheet[idx]?.choices.includes(v);
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      if (id) {
        startTransition(async () => {
          const res = await getQuiz(id);
          if (res.error || !res.data) {
            toast.addToast("error", res.error || "Quiz not found");
            router.back();
          } else {
            const initialSheet: Answer[] = res.data.questions.map(() => ({
              choices: [],
            }));
            setAnswerSheet(initialSheet);
            setQuiz(res.data);
          }
        });
      }
    };
    fetchQuiz();
  }, [id, router, toast]);

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-secondary">Loading Quiz...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen mx-auto max-w-4xl p-6">
      <div className="flex flex-row mt-8 mb-6 items-center gap-4 group">
        <div
          className="rounded-full shadow size-8 flex items-center justify-center p-2 dark:bg-surface-2 transition cursor-pointer group-hover:dark:bg-orange-500"
          onClick={() => router.back()}
        >
          <BackArrow className="hover:underline group-hover:dark:fill-primary dark:fill-accent-0" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold dark:text-accent-0">
            {quiz.title}
          </h1>
          <p className="text-sm dark:text-secondary italic">
            Time Limit: {quiz.duration} seconds • Total Points: {quiz.point}
          </p>
        </div>
      </div>

      {showAlert && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm font-medium animate-bounce text-center">
          ⚠ Please complete all questions before submitting
        </div>
      )}

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="space-y-6">
          {quiz.questions.map((item, idx) => (
            <div
              key={item.id}
              className="p-6 rounded-xl bg-surface-1 border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-bold text-accent-0 uppercase tracking-widest">
                  Question {idx + 1}
                </span>
                <span className="text-xs font-semibold px-2 py-1 bg-surface-2 rounded text-secondary">
                  {item.point} points
                </span>
              </div>

              <p className="text-lg font-medium dark:text-primary mb-6 leading-relaxed">
                {item.content}
              </p>

              <div className="grid grid-cols-1 gap-3">
                {item.choices.map((c) => (
                  <label
                    key={c.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${isChecked(idx, c.id)
                      ? "border-accent-0 bg-accent-0/5 dark:bg-accent-0/10 shadow-inner"
                      : "border-border hover:border-accent-0/30 dark:bg-surface-0"
                      }`}
                  >
                    <input
                      type="checkbox"
                      className="size-5 accent-accent-0 rounded border-gray-300 focus:ring-accent-0"
                      value={c.id}
                      onChange={(e) => toggleChoice(e, idx)}
                      checked={isChecked(idx, c.id)}
                    />
                    <span
                      className={`text-sm font-medium transition-colors ${isChecked(idx, c.id) ? "text-accent-0" : "dark:text-secondary"}`}
                    >
                      {c.content}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-6 mt-12 flex justify-center">
          <button
            type="submit"
            disabled={isPending}
            className="px-12 py-4 bg-accent-0 hover:bg-accent-1 text-white text-lg font-bold rounded-xl shadow-xl shadow-accent-0/20 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
          >
            {isPending ? "Submitting..." : "Submit Answers"}
          </button>
        </div>
      </form>
    </div>
  );
}
