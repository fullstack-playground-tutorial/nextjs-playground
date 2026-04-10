"use client";

import React, { use, useState, useTransition } from "react";
import { useRouter, useParams } from "next/navigation";
import type { FlashcardSet, Flashcard } from "@/app/feature/flashcard";
import { createFlashcardSet, updateFlashcardSet } from "@/app/feature/flashcard/action";
import useToast from "@/app/components/Toast";
import { ActionButtons } from "../../../components/ActionButtons/ActionButtons";
import { getLocaleService } from "@/app/utils/resource/locales";
import dynamic from "next/dynamic";

const PdfFlashcardGenerator = dynamic(
  () => import("./PdfFlashcardGenerator"),
  { ssr: false }
);

const FormFieldLabel = ({
    children,
    required = false,
    optional = false,
    className = ""
}: {
    children: React.ReactNode,
    required?: boolean,
    optional?: boolean,
    className?: string
}) => (
    <label className={`text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1 ${className}`}>
        {children}
        {required && <span className="text-red-500 text-sm">*</span>}
        {optional && <span className="text-[10px] font-normal lowercase text-secondary/60 ml-auto">(optional)</span>}
    </label>
);

type Props = {
    mode: "create" | "edit" | "view";
    fetchedSetPromise?: Promise<FlashcardSet | undefined>;
};

type InternalState = {
    set: FlashcardSet;
    errors: Record<string, string>;
};

export default function FlashcardForm({ mode, fetchedSetPromise: setPromise }: Props) {
    const params = useParams();
    const { localize } = getLocaleService(params.lang as string);
    const fetchedSet = setPromise ? use(setPromise) : undefined;

    const [state, setState] = useState<InternalState>({
        set: {
            cards: [],
            name: "",
            description: "",
            isPublic: false,
            id: "", // Generated at backend
            ...fetchedSet
        },
        errors: {}
    });

    const router = useRouter();
    const toast = useToast();
    const [isPending, startTransition] = useTransition();
    const [showPdfGenerator, setShowPdfGenerator] = useState(false);

    const handleAddGeneratedCards = (newCards: Flashcard[]) => {
        setState((prev) => ({
            ...prev,
            set: {
                ...prev.set,
                cards: [
                    ...(prev.set.cards || []),
                    ...newCards,
                ],
            },
        }));
        toast.addToast("success", `Added ${newCards.length} cards from PDF`);
    };

    const handleAddCard = (e: React.MouseEvent) => {
        e.preventDefault();
        setState((prev) => ({
            ...prev,
            set: {
                ...prev.set,
                cards: [
                    ...(prev.set.cards || []),
                    {
                        front: "",
                        back: "",
                        example: "",
                        status: "draft",
                    } as Flashcard,
                ],
            },
        }));
    };

    const handleDeleteCard = (e: React.MouseEvent, index: number) => {
        e.preventDefault();
        const newCards = (state.set.cards || []).filter((_, i) => i !== index);
        setState((prev) => ({
            ...prev,
            set: { ...prev.set, cards: newCards },
        }));
    };

    const handleChangeCard = (
        field: "front" | "back" | "example",
        value: string,
        index: number,
    ) => {
        const copy = [...(state.set.cards || [])];
        (copy[index] as any)[field] = value;
        setState((prev) => ({ ...prev, set: { ...prev.set, cards: copy } }));
    };

    const handleConfirmCard = (e: React.MouseEvent, index: number) => {
        e.preventDefault();
        const newCards = [...(state.set.cards || [])];
        newCards[index].status = "done";
        setState((prev) => ({
            ...prev,
            set: { ...prev.set, cards: newCards },
        }));
    };

    const handleSave = async () => {
        setState(prev => ({ ...prev, errors: {} }));
        startTransition(async () => {
            const setToSave = { ...state.set };
            let res;
            if (mode === "create") {
                res = await createFlashcardSet(setToSave);
            } else {
                res = await updateFlashcardSet(setToSave);
            }

            if (res.validationErrors) {
                setState(prev => ({ ...prev, errors: res.validationErrors! }));
                toast.addToast("error", "Please fix the errors in the form");
            } else if (res.error) {
                toast.addToast("error", res.error);
            } else {
                toast.addToast(
                    "success",
                    res.successMsg || "Successfully saved",
                );
                router.back();
            }
        });
    };

    const handleCancel = () => {
        router.back();
    };

    const { errors } = state;
    const isViewMode = mode === "view";

    return (
        <>
            <form className="flex flex-col gap-6 w-full bg-white dark:bg-surface-1 p-8 rounded-xl border dark:border-border shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <FormFieldLabel required>
                        {localize("flashcard_set_name")}
                    </FormFieldLabel>
                    <input
                        type="text"
                        placeholder="Enter set name..."
                        disabled={isViewMode}
                        className={`px-4 py-2 rounded-lg border dark:bg-surface-0 outline-none focus:border-accent-0 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${errors.name ? 'border-red-500' : 'dark:border-border'}`}
                        onChange={(e) => {
                            const name = e.target.value;
                            setState({
                                ...state,
                                set: { ...state.set, name },
                            })
                        }}
                        value={state.set.name}
                    />
                    {errors.name && <span className="text-alert-0 text-xs">{errors.name}</span>}
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <FormFieldLabel optional className="flex-1">
                            {localize("flashcard_set_description")}
                        </FormFieldLabel>
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-bold text-secondary uppercase">Public</label>
                            <input
                                type="checkbox"
                                checked={state.set.isPublic}
                                disabled={isViewMode}
                                onChange={(e) => setState({ ...state, set: { ...state.set, isPublic: e.target.checked } })}
                                className="size-4 accent-accent-0"
                            />
                        </div>
                    </div>
                    <input
                        type="text"
                        placeholder="Brief description..."
                        disabled={isViewMode}
                        className="px-4 py-2 rounded-lg border dark:border-border dark:bg-surface-0 outline-none focus:border-accent-0 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        onChange={(e) =>
                            setState({
                                ...state,
                                set: { ...state.set, description: e.target.value },
                            })
                        }
                        value={state.set.description || ""}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between items-center py-4 border-y dark:border-border">
                    <div className="px-4 py-2 bg-accent-0/10 rounded-full">
                        <span className="text-sm font-bold text-accent-0">
                            {state.set.cards?.length || 0} Cards
                        </span>
                    </div>
                </div>
                {errors.cards && <span className="text-alert-0 text-center text-xs mt-2 font-bold">{errors.cards}</span>}
            </div>

            <div className="flex flex-col gap-6 mt-4">
                {state.set.cards?.map((item, index) =>
                    item.status === "draft" ? (
                        <div
                            key={index}
                            className={`flex flex-col gap-4 border rounded-xl p-6 bg-accent-0/5 ${Object.keys(errors).some(k => k.startsWith(`cards.${index}`)) ? 'border-red-500/50' : 'dark:border-accent-0/30'}`}
                        >
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-accent-0">
                                    Card #{index + 1}
                                </h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <FormFieldLabel required>
                                        {localize("flashcard_front")}
                                    </FormFieldLabel>
                                    <textarea
                                        placeholder="Type front content..."
                                        value={item.front}
                                        disabled={isViewMode}
                                        onChange={(e) => handleChangeCard("front", e.target.value, index)}
                                        className={`w-full min-h-[100px] px-4 py-3 rounded-lg border dark:bg-surface-0 outline-none focus:border-accent-0 transition-colors resize-none disabled:opacity-60 disabled:cursor-not-allowed ${errors[`cards.${index}.front`] ? 'border-red-500' : 'dark:border-border'}`}
                                    />
                                    {errors[`cards.${index}.front`] && <span className="text-alert-0 text-xs">{errors[`cards.${index}.front`]}</span>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <FormFieldLabel required>
                                        {localize("flashcard_back")}
                                    </FormFieldLabel>
                                    <textarea
                                        placeholder="Type back content..."
                                        value={item.back}
                                        disabled={isViewMode}
                                        onChange={(e) => handleChangeCard("back", e.target.value, index)}
                                        className={`w-full min-h-[100px] px-4 py-3 rounded-lg border dark:bg-surface-0 outline-none focus:border-accent-0 transition-colors resize-none disabled:opacity-60 disabled:cursor-not-allowed ${errors[`cards.${index}.back`] ? 'border-red-500' : 'dark:border-border'}`}
                                    />
                                    {errors[`cards.${index}.back`] && <span className="text-alert-0 text-xs">{errors[`cards.${index}.back`]}</span>}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <FormFieldLabel optional>
                                    {localize("flashcard_example")}
                                </FormFieldLabel>
                                <textarea
                                    placeholder="Type an example sentence..."
                                    value={item.example || ""}
                                    disabled={isViewMode}
                                    onChange={(e) => handleChangeCard("example", e.target.value, index)}
                                    className={`w-full min-h-[60px] px-4 py-2 rounded-lg border dark:bg-surface-0 outline-none focus:border-accent-0 transition-colors resize-none text-sm disabled:opacity-60 disabled:cursor-not-allowed dark:border-border`}
                                />
                            </div>

                            {!isViewMode && (
                                <div className="flex gap-3 self-end mt-4">
                                    <button
                                        type="button"
                                        className="px-4 py-2 rounded-lg border border-accent-0 text-accent-0 hover:bg-accent-0 hover:text-white transition-colors text-sm font-bold"
                                        onClick={(e) => handleConfirmCard(e, index)}
                                    >
                                        {localize("flashcard_confirm")}
                                    </button>
                                    <button
                                        type="button"
                                        className="px-4 py-2 rounded-lg text-secondary hover:text-alert-0 transition-colors text-sm font-bold"
                                        onClick={(e) => handleDeleteCard(e, index)}
                                    >
                                        {localize("flashcard_discard")}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div
                            key={index}
                            className={`flex flex-col gap-3 p-6 rounded-xl border transition-colors ${Object.keys(errors).some(k => k.startsWith(`cards.${index}`)) ? 'border-red-500' : `dark:border-border ${!isViewMode ? 'hover:border-accent-0/50 cursor-pointer' : ''}`}`}
                            onClick={() => {
                                if (isViewMode) return;
                                const newCards = [...(state.set.cards || [])];
                                newCards[index].status = "draft";
                                setState((prev) => ({
                                    ...prev,
                                    set: { ...prev.set, cards: newCards },
                                }));
                            }}
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-secondary uppercase">
                                    Card #{index + 1}
                                </span>
                                {Object.keys(errors).some(k => k.startsWith(`cards.${index}`)) && <span className="text-alert-0 text-[10px] font-bold">HAS ERRORS</span>}
                            </div>
                            <div className="grid grid-cols-2 gap-8 mt-2">
                                <div className="p-4 rounded bg-surface-2/30 border border-border/50">
                                    <span className="text-[10px] font-bold text-secondary uppercase block mb-1">Front</span>
                                    <p className="font-semibold dark:text-primary whitespace-pre-wrap">{item.front}</p>
                                </div>
                                <div className="p-4 rounded bg-accent-0/5 border border-accent-0/20">
                                    <span className="text-[10px] font-bold text-accent-0 uppercase block mb-1">Back</span>
                                    <p className="font-semibold dark:text-primary whitespace-pre-wrap">{item.back}</p>
                                    {item.example && (
                                        <p className="mt-2 text-xs italic text-secondary border-t dark:border-border/30 pt-2">
                                            "{item.example}"
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ),
                )}

                {!isViewMode && (
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={(e) => handleAddCard(e)}
                            className="flex-1 py-4 rounded-xl border-2 border-dashed border-border hover:border-accent-0 hover:bg-accent-0/5 transition-all text-secondary hover:text-accent-0 font-bold"
                        >
                            + {localize("flashcard_add_card")}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowPdfGenerator(true)}
                            className="flex-none px-6 py-4 rounded-xl border-2 border-dashed border-indigo-500/30 hover:border-indigo-500 hover:bg-indigo-500/5 transition-all text-indigo-500 font-bold flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            {localize("flashcard_ai_generate_from_pdf")}
                        </button>
                    </div>
                )}
            </div>

            <ActionButtons
                mode={mode}
                mutationPendings={{
                    submit: isPending,
                }}
                onCancel={handleCancel}
                onSubmit={handleSave}
                modeActionConfig={{
                    create: ["submit"],
                    edit: ["submit"],
                    view: [],
                }}
                buttonAppearanceConfig={{
                    submit: {
                        label: mode === "create" ? "Create Set" : "Save Changes",
                        waitingLabel: "Saving...",
                        className: "dark:bg-accent-0 hover:dark:bg-accent-1",
                    }
                }}
            />
        </form>
        {showPdfGenerator && (
            <PdfFlashcardGenerator 
                existingCards={state.set.cards || []}
                onAddCards={handleAddGeneratedCards} 
                onClose={() => setShowPdfGenerator(false)} 
                localize={localize}
            />
        )}
    </>
  );
}
