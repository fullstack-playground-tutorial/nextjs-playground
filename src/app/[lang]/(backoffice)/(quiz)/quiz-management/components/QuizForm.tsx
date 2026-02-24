"use client";

import React, { use, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Quiz, Question } from "@/app/feature/quiz";
import { createQuiz, updateQuiz } from "@/app/feature/quiz/action";
import useToast from "@/app/components/Toast";
import { ActionButtons } from "../../../components/ActionButtons/ActionButtons";

type Props = {
    mode: "create" | "edit" | "view";
    fetchedQuizPromise?: Promise<Quiz | undefined>;
};

type InternalState = {
    quiz: Quiz;
    errors: Record<string, string>;
};

export default function QuizForm({ mode, fetchedQuizPromise: quizPromise }: Props) {
    const fetchedQuiz = quizPromise ? use(quizPromise) : undefined;
    const [state, setState] = useState<InternalState>({
        quiz: fetchedQuiz ?? {
            questions: [],
            status: "draft",
            duration: 60, // 60 minutes
            title: "",
            description: "",
            id: "", // Generated at backend
            slug: ""
        },
        errors: {}
    });

    const router = useRouter();
    const toast = useToast();
    const [isPending, startTransition] = useTransition();

    const handleAddChoice = (e: React.MouseEvent, questionIndex: number) => {
        e.preventDefault();
        const newQuestions = [...state.quiz.questions];
        newQuestions[questionIndex].answers.push({
            content: "",
            isCorrect: false,
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
                        content: "",
                        answers: [],
                        point: 0,
                        type: "single_choice",
                        status: "draft",
                        explanation: "",
                    } as Question,
                ],
            },
        }));
    };

    const handleDeleteQuestion = (e: React.MouseEvent, index: number) => {
        e.preventDefault();
        const newQuestions = state.quiz.questions.filter((_, i) => i !== index);
        setState((prev) => ({
            ...prev,
            quiz: { ...prev.quiz, questions: newQuestions },
        }));
    };

    const toggleAnswer = (
        e: React.ChangeEvent<HTMLInputElement>,
        questionIndex: number,
        answerIndex: number,
    ) => {
        const newQuestions = [...state.quiz.questions];
        const q = newQuestions[questionIndex];

        if (q.type === "single_choice") {
            q.answers = q.answers.map((a, idx) => ({
                ...a,
                isCorrect: idx === answerIndex,
            }));
        } else {
            q.answers = q.answers.map((a, idx) =>
                idx === answerIndex ? { ...a, isCorrect: !a.isCorrect } : a,
            );
        }

        setState((prev) => ({
            ...prev,
            quiz: { ...prev.quiz, questions: newQuestions },
        }));
    };

    const handleChangeQuestion = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        index: number,
    ) => {
        const copy = [...state.quiz.questions];
        copy[index].content = e.target.value;

        setState((prev) => ({ ...prev, quiz: { ...prev.quiz, questions: copy } }));
    };

    const handleChangeQuestionExplanation = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        index: number,
    ) => {
        const copy = [...state.quiz.questions];
        copy[index].explanation = e.target.value;

        setState((prev) => ({ ...prev, quiz: { ...prev.quiz, questions: copy } }));
    };

    const handleChangeQuestionPoint = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number,
    ) => {
        const point = Number.parseFloat(e.target.value);
        if (Number.isNaN(point)) {
            return;
        }

        const copy = [...state.quiz.questions];
        copy[index].point = point;
        setState((prev) => ({ ...prev, quiz: { ...prev.quiz, questions: copy } }));
    };

    const handleChangeChoice = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        questionIndex: number,
        answerIndex: number,
    ) => {
        const copy = [...state.quiz.questions];
        copy[questionIndex].answers[answerIndex].content = e.target.value;
        setState((prev) => ({ ...prev, quiz: { ...prev.quiz, questions: copy } }));
    };

    const handleDeleteChoice = (
        e: React.MouseEvent,
        questionIndex: number,
        answerIndex: number,
    ) => {
        e.preventDefault();
        const newQuestions = [...state.quiz.questions];
        newQuestions[questionIndex].answers = newQuestions[questionIndex].answers.filter(
            (_, i) => i !== answerIndex,
        );
        setState((prev) => ({
            ...prev,
            quiz: { ...prev.quiz, questions: newQuestions },
        }));
    };

    const handleSaveQuestion = (e: React.MouseEvent, index: number) => {
        e.preventDefault();
        const newQuestions = [...state.quiz.questions];
        newQuestions[index].status = "done";
        setState((prev) => ({
            ...prev,
            quiz: { ...prev.quiz, questions: newQuestions },
        }));
    };

    const handleChangeQuizTimeout = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const newTimeout = parseFloat(val);
        if (!Number.isNaN(newTimeout)) {
            setState((prev) => ({
                ...prev,
                quiz: { ...prev.quiz, duration: newTimeout },
            }));
        }
    };

    const handleCreate = async (targetStatus: "draft" | "publish") => {
        setState(prev => ({ ...prev, errors: {} }));
        startTransition(async () => {
            const quizToSave = { ...state.quiz, status: targetStatus };
            const res = await createQuiz(quizToSave);
            if (res.validationErrors) {
                setState(prev => ({ ...prev, errors: res.validationErrors! }));
                toast.addToast("error", "Please fix the errors in the form");
            } else if (res.error) {
                toast.addToast("error", res.error);
            } else {
                toast.addToast(
                    "success",
                    res.successMsg || "Successfully created quiz",
                );
                router.back();
            }
        });
    };

    const handleUpdate = async (targetStatus: "draft" | "publish") => {
        setState(prev => ({ ...prev, errors: {} }));
        startTransition(async () => {
            const quizToSave = { ...state.quiz, status: targetStatus };
            try {
                const res = await updateQuiz(quizToSave);
                if (res.validationErrors) {
                    setState(prev => ({ ...prev, errors: res.validationErrors! }));
                    toast.addToast("error", "Please fix the errors in the form");
                } else {
                    toast.addToast(
                        "success",
                        res.successMsg || "Successfully updated quiz",
                    );
                    router.back();
                }
            } catch (error) {
                throw error;
            }

        });
    };

    const handleSaveDraft = () => {
        if (mode == "create") {
            handleCreate("draft");
        } else if (mode == "edit") {
            handleUpdate("draft");
        }
    };

    const handleSubmit = () => {
        if (mode == "create") {
            handleCreate("publish");
        } else if (mode == "edit") {
            handleUpdate("publish");
        }
    };

    const handleCancel = () => {
        router.back();
    };

    const currentPoint = useMemo(() => {
        let newQuizPoint = 0;
        state.quiz.questions.forEach((v) => {
            newQuizPoint = newQuizPoint + v.point;
        });
        return newQuizPoint;
    }, [state.quiz.questions]);

    const { quiz, errors } = state;
    const isViewMode = mode === "view";

    return (
        <form className="flex flex-col gap-6 w-full bg-white dark:bg-surface-1 p-8 rounded-xl border dark:border-border shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-secondary uppercase tracking-wider">
                        Quiz Title
                    </label>
                    <input
                        type="text"
                        placeholder="Enter quiz title..."
                        disabled={isViewMode}
                        className={`px-4 py-2 rounded-lg border dark:bg-surface-0 outline-none focus:border-accent-0 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${errors.title ? 'border-red-500' : 'dark:border-border'}`}
                        onChange={(e) => {
                            const title = e.target.value;
                            const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
                            setState({
                                ...state,
                                quiz: { ...state.quiz, title, slug },
                            })
                        }}
                        value={state.quiz.title}
                    />
                    {errors.title && <span className="text-alert-0 text-xs">{errors.title}</span>}
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-secondary uppercase tracking-wider">
                        Description
                    </label>
                    <input
                        type="text"
                        placeholder="Brief description..."
                        disabled={isViewMode}
                        className="px-4 py-2 rounded-lg border dark:border-border dark:bg-surface-0 outline-none focus:border-accent-0 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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

            <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between items-center py-4 border-y dark:border-border">
                    <div className="flex flex-row gap-4 items-center">
                        <div className="flex flex-col">
                            <label className="text-[10px] font-bold text-secondary uppercase">
                                Total Points
                            </label>
                            <div className="flex items-center gap-2">
                                <span className="font-bold dark:text-primary text-xl">
                                    {currentPoint}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-[10px] font-bold text-secondary uppercase">
                                Time (Minutes)
                            </label>
                            <input
                                type="number"
                                disabled={isViewMode}
                                className="w-24 px-2 py-1 rounded bg-transparent border-b border-accent-0/30 focus:border-accent-0 outline-none text-center font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                                value={quiz.duration}
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
                {errors.questions && <span className="text-alert-0 text-center text-xs mt-2 font-bold">{errors.questions}</span>}
            </div>

            <div className="flex flex-col gap-6 mt-4">
                {quiz.questions.map((item, index) =>
                    item.status === "draft" ? (
                        <div
                            key={index}
                            className={`flex flex-col gap-4 border rounded-xl p-6 bg-accent-0/5 ${Object.keys(errors).some(k => k.startsWith(`questions.${index}`)) ? 'border-red-500/50' : 'dark:border-accent-0/30'}`}
                        >
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-accent-0">
                                    Question #{index + 1}
                                </h4>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs font-bold text-secondary">
                                            Type:
                                        </label>
                                        <select
                                            disabled={isViewMode}
                                            className="px-2 py-1 rounded border dark:border-border dark:bg-surface-0 outline-none text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                                            value={item.type}
                                            onChange={(e) => {
                                                const newQuestions = [...quiz.questions];
                                                newQuestions[index].type = e.target.value as any;
                                                setState((prev) => ({ ...prev, quiz: { ...prev.quiz, questions: newQuestions } }));
                                            }}
                                        >
                                            <option value="single_choice">Single Choice</option>
                                            <option value="multiple_choice">Multiple Choice</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1 items-end">
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs font-bold text-secondary">
                                                Points:
                                            </label>
                                            <input
                                                type="number"
                                                disabled={isViewMode}
                                                className={`w-16 px-2 py-1 rounded border dark:bg-surface-0 outline-none text-xs disabled:opacity-60 disabled:cursor-not-allowed ${errors[`questions.${index}.point`] ? 'border-red-500' : 'dark:border-border'}`}
                                                value={item.point}
                                                onChange={(e) => handleChangeQuestionPoint(e, index)}
                                            />
                                        </div>
                                        {errors[`questions.${index}.point`] && <span className="text-alert-0 text-[10px]">{errors[`questions.${index}.point`]}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <textarea
                                    placeholder="Type your question here..."
                                    value={item.content}
                                    disabled={isViewMode}
                                    onChange={(e) => handleChangeQuestion(e, index)}
                                    className={`w-full min-h-[100px] px-4 py-3 rounded-lg border dark:bg-surface-0 outline-none focus:border-accent-0 transition-colors resize-none disabled:opacity-60 disabled:cursor-not-allowed disabled:resize-none ${errors[`questions.${index}.content`] ? 'border-red-500' : 'dark:border-border'}`}
                                />
                                {errors[`questions.${index}.content`] && <span className="text-alert-0 text-xs">{errors[`questions.${index}.content`]}</span>}
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-secondary uppercase">
                                    Choices
                                </label>
                                {item.answers.map((c, cIndex) => (
                                    <div key={cIndex} className="flex flex-col gap-1">
                                        <div className="flex gap-3 items-center">
                                            <input
                                                type={item.type === "single_choice" ? "radio" : "checkbox"}
                                                name={`question-${index}`}
                                                className="size-5 accent-accent-0 shrink-0 disabled:cursor-not-allowed"
                                                checked={c.isCorrect}
                                                disabled={isViewMode}
                                                onChange={(e) => toggleAnswer(e, index, cIndex)}
                                            />
                                            <textarea
                                                placeholder="Choice content..."
                                                value={c.content}
                                                disabled={isViewMode}
                                                onChange={(e) => handleChangeChoice(e, index, cIndex)}
                                                className={`flex-1 min-h-[40px] px-4 py-2 rounded-lg border dark:bg-surface-0 outline-none focus:border-accent-0 transition-colors resize-none text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:resize-none ${errors[`questions.${index}.answers.${cIndex}.content`] ? 'border-red-500' : 'dark:border-border'}`}
                                            />
                                            {!isViewMode && (
                                                <button
                                                    type="button"
                                                    className="p-2 transition-colors hover:text-alert-0"
                                                    onClick={(e) => handleDeleteChoice(e, index, cIndex)}
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                        {errors[`questions.${index}.answers.${cIndex}.content`] && <span className="text-alert-0 text-[10px] ml-8">{errors[`questions.${index}.answers.${cIndex}.content`]}</span>}
                                    </div>
                                ))}
                                <div className="flex flex-col gap-2">
                                    {!isViewMode && (
                                        <button
                                            type="button"
                                            className="text-sm font-bold text-accent-0 hover:underline px-2 self-start"
                                            onClick={(e) => handleAddChoice(e, index)}
                                        >
                                            + Add Choice
                                        </button>
                                    )}
                                    {errors[`questions.${index}.answers`] && <span className="text-alert-0 text-xs px-2">{errors[`questions.${index}.answers`]}</span>}
                                    {errors[`questions.${index}.correctAnswer`] && <span className="text-alert-0 text-xs px-2 font-bold">{errors[`questions.${index}.correctAnswer`]}</span>}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 mt-4 pt-4 border-t dark:border-border">
                                <label className="text-xs font-bold text-secondary uppercase tracking-wider">
                                    Explanation (Optional)
                                </label>
                                <textarea
                                    placeholder="Explain why the answer is correct..."
                                    value={item.explanation || ""}
                                    disabled={isViewMode}
                                    onChange={(e) => handleChangeQuestionExplanation(e, index)}
                                    className="w-full min-h-[80px] px-4 py-3 rounded-lg border dark:border-border dark:bg-surface-0 outline-none focus:border-accent-0 transition-colors resize-none text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:resize-none"
                                />
                            </div>

                            {!isViewMode && (
                                <div className="flex gap-3 self-end mt-4">
                                    <button
                                        type="button"
                                        className="px-4 py-2 rounded-lg border border-accent-0 text-accent-0 hover:bg-accent-0 hover:text-white transition-colors text-sm font-bold"
                                        onClick={(e) => handleSaveQuestion(e, index)}
                                    >
                                        Confirm Question
                                    </button>
                                    <button
                                        type="button"
                                        className="px-4 py-2 rounded-lg text-secondary hover:text-alert-0 transition-colors text-sm font-bold"
                                        onClick={(e) => handleDeleteQuestion(e, index)}
                                    >
                                        Discard
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div
                            key={index}
                            className={`flex flex-col gap-3 p-6 rounded-xl border transition-colors ${Object.keys(errors).some(k => k.startsWith(`questions.${index}`)) ? 'border-red-500' : `dark:border-border ${!isViewMode ? 'hover:border-accent-0/50 cursor-pointer' : ''}`}`}
                            onClick={() => {
                                if (isViewMode) return;
                                const newQuestions = [...quiz.questions];
                                newQuestions[index].status = "draft";
                                setState((prev) => ({
                                    ...prev,
                                    quiz: { ...prev.quiz, questions: newQuestions },
                                }));
                            }}
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-secondary uppercase">
                                    Question #{index + 1} • {item.point} Points
                                </span>
                                {Object.keys(errors).some(k => k.startsWith(`questions.${index}`)) && <span className="text-alert-0 text-[10px] font-bold">HAS ERRORS</span>}
                            </div>
                            <p className="font-semibold dark:text-primary">
                                {item.content}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {item.answers.map((c, cIndex) => (
                                    <div
                                        key={cIndex}
                                        className={`px-3 py-1 rounded-full text-xs border ${c.isCorrect ? "border-accent-0 bg-accent-0/10 text-accent-0" : "border-border text-secondary"}`}
                                    >
                                        {c.content}
                                    </div>
                                ))}
                            </div>
                            {item.explanation && (
                                <div className="mt-2 text-xs italic text-secondary">
                                    <span className="font-bold">Explanation:</span> {item.explanation}
                                </div>
                            )}
                        </div>
                    ),
                )}

                {!isViewMode && (
                    <button
                        type="button"
                        onClick={(e) => handleAddQuestion(e)}
                        className="w-full py-4 rounded-xl border-2 border-dashed border-border hover:border-accent-0 hover:bg-accent-0/5 transition-all text-secondary hover:text-accent-0 font-bold"
                    >
                        + Add New Question
                    </button>
                )}
            </div>
            <ActionButtons
                mode={mode}
                mutationPendings={{
                    submit: isPending,
                    draft: isPending,
                }}
                status={state.quiz.status}
                onCancel={handleCancel}
                onSubmit={handleSubmit}
                onSaveDraft={handleSaveDraft}
                modeActionConfig={{
                    create: ["draft", "submit"],
                    edit: ["draft", "submit"],
                    view: [],
                }}
                buttonAppearanceConfig={{
                    submit: {
                        label: "Published",
                        waitingLabel: "Publishing...",
                        className: "dark:bg-accent-0 hover:dark:bg-accent-1",
                    },
                }}
            />
        </form>
    );
}
