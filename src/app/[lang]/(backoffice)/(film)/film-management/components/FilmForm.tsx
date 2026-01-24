"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import FloatInput from "../../../components/FloatInput";
import FloatTextarea from "../../../components/FloatTextarea";
import AutoComplete from "../../../components/AutoComplete";
import Uploader from "../../../../../components/Upload";
import { Film, Interest } from "@/app/feature/film";
import { createFilm, updateFilm } from "@/app/feature/film/action";
import { ActionButtons, ActionStatus } from "../../../components/ActionButtons/ActionButtons";
import useToast from "@/components/Toast";
import BackArrow from "@/assets/images/icons/back_arrow.svg";
import { User } from "@/app/feature/auth";

type Props = {
    film?: Film;
    suggestions: Interest[] | undefined;
}

type InternalState = {
    film: Film;
    interestQ: string;
};

const getDefaultFilm = (): Film => ({
    id: "",
    title: "",
    subTitle: "",
    description: "",
    numberOfEpisodes: 0,
    trailerURL: "",
    interests: [],
    interestIds: [],
    slug: "",
});

const getFilmMode = (pathname: string, id?: string) => {
    if (pathname.endsWith("/create") && !id) return "create";
    if (pathname.endsWith("/edit") && id) return "edit";
    if (pathname.endsWith("/review") && id) return "review";
    if (id) return "view";
    return "unknown";
};

export default function FilmForm({ film, suggestions }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const toast = useToast();

    // Mode detection
    const mode = getFilmMode(pathname, film?.id);
    const isViewOrReview = mode === "view" || mode === "review";

    // State
    const [state, setState] = useState<InternalState>({
        film: film ? { ...film } : getDefaultFilm(),
        interestQ: "",
    });

    const [debouncedQ, setDebouncedQ] = useState("");

    // Transitions for actions
    const [submitting, startSubmitting] = useTransition();
    const [drafting, startDrafting] = useTransition();
    const [approving, startApproving] = useTransition();
    const [rejecting, startRejecting] = useTransition();

    // Refs for uploads
    const posterInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);

    // Initial previews (derived from film data or new uploads)
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [posterPreview, setPosterPreview] = useState<string>(film?.posterURL || "");

    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string>(film?.bannerURL || "");

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>(film?.logoURL || "");

    // Sync state with props if they change (re-validation/refetch)
    useEffect(() => {
        if (film) {
            setState(prev => ({ ...prev, film: { ...film } }));
            setLogoPreview(film.logoURL || "");
            // logic for images...
        }
    }, [film]);

    // Search Debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQ(state.interestQ);
        }, 400);
        return () => clearTimeout(handler);
    }, [state.interestQ]);

    // URL Sync for Interest Search
    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (debouncedQ) {
            params.set("interest_q", debouncedQ);
        } else {
            params.delete("interest_q");
        }
        router.replace(`${pathname}?${params.toString()}`);
    }, [debouncedQ]);

    const updateFilmState = (vals: Partial<Film>) => {
        setState(prev => ({ ...prev, film: { ...prev.film, ...vals } }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // Handle number fields
        if (name === "numberOfEpisodes") {
            updateFilmState({ [name]: parseInt(value) || 0 });
        } else {
            updateFilmState({ [name]: value as any });
        }
    };

    const handleFileDrop = (files: FileList, type: 'poster' | 'banner' | 'logo') => {
        if (files && files[0]) {
            const file = files[0];
            const url = URL.createObjectURL(file);
            if (type === 'poster') {
                setPosterFile(file);
                setPosterPreview(url);
            } else if (type === 'banner') {
                setBannerFile(file);
                setBannerPreview(url);
            } else {
                setLogoFile(file);
                setLogoPreview(url);
                updateFilmState({ logoURL: fileName(file) }); // Mock setting URL to filename
            }
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'poster' | 'banner' | 'logo') => {
        if (e.target.files && e.target.files[0]) {
            handleFileDrop(e.target.files, type);
        }
    };

    const fileName = (f: File | null) => f?.name || "";

    const getPayload = () => {
        return {
            ...state.film,
            logoURL: logoFile ? logoFile.name : state.film.logoURL,
            posterURL: posterFile ? posterFile.name : state.film.posterURL,
            bannerURL: bannerFile ? bannerFile.name : state.film.bannerURL,
        };
    };

    const handleAction = (status: ActionStatus) => {
        const payload = getPayload();
        // Determine which transition to use based on status
        const performAction = async () => {
            try {
                let res;
                if (mode === "create") {
                    if (!logoFile || !posterFile || !bannerFile) {
                        toast.addToast("error", "Please upload all required files");
                        return;
                    }
                    res = await createFilm({ ...payload }, logoFile, posterFile, bannerFile); // status would be passed if API supported it
                } else if (mode === "edit" || mode === "review") {
                    res = await updateFilm(state.film.id, { ...payload });
                }

                if (res?.successMsg) {
                    toast.addToast("success", res.successMsg);
                    router.back();
                }
            } catch (error: any) {
                toast.addToast("error", error.message || "An error occurred");
            }
        };

        if (status === "draft") startDrafting(performAction);
        if (status === "submit") startSubmitting(performAction);
        if (status === "approve") startApproving(performAction);
        if (status === "reject") startRejecting(performAction);
    };

    return (
        <div className="flex flex-col h-screen items-start mx-auto max-w-5xl p-6">
            {/* Header */}
            <div className="flex flex-row justify-between mt-8 mb-6 items-center group w-full">
                <div className="flex flex-row gap-4 items-center">
                    <div
                        className="rounded-full shadow size-8 flex items-center justify-center p-2 dark:bg-surface-2 transition cursor-pointer group-hover:dark:bg-orange-500"
                        onClick={() => router.back()}
                    >
                        <BackArrow className="hover:underline group-hover:dark:fill-primary dark:fill-accent-0" />
                    </div>
                    <div className="text-2xl font-semibold dark:text-accent-0">
                        {mode === "create" ? "Create New Film" :
                            mode === "edit" ? `Edit Film - ${state.film.title}` :
                                mode === "review" ? `Review Film - ${state.film.title}` :
                                    `View Film - ${state.film.title}`}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
                {/* Left Column: Image Uploads */}
                <div className="flex flex-col gap-6">
                    {/* Poster */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium dark:text-secondary">Poster Image</label>
                        <div
                            className={`w-full aspect-[2/3] bg-gray-100 dark:bg-surface-1 rounded-lg overflow-hidden border-2 border-dashed dark:border-border relative group ${!isViewOrReview ? 'cursor-pointer' : ''}`}
                            onClick={() => !isViewOrReview && posterInputRef.current?.click()}
                        >
                            <Uploader handleDrop={(files) => !isViewOrReview && handleFileDrop(files, 'poster')}>
                                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                                    {posterPreview ? (
                                        <img src={posterPreview} alt="Poster" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <span className="text-4xl mb-2">🖼️</span>
                                            <p className="text-xs dark:text-secondary">Click or Drop Poster</p>
                                        </>
                                    )}
                                    {!isViewOrReview && (
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium">
                                            Change Image
                                        </div>
                                    )}
                                </div>
                            </Uploader>
                            <input type="file" ref={posterInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, 'poster')} disabled={isViewOrReview} />
                        </div>
                    </div>

                    {/* Banner */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium dark:text-secondary">Banner Image</label>
                        <div
                            className={`w-full aspect-video bg-gray-100 dark:bg-surface-1 rounded-lg overflow-hidden border-2 border-dashed dark:border-border relative group ${!isViewOrReview ? 'cursor-pointer' : ''}`}
                            onClick={() => !isViewOrReview && bannerInputRef.current?.click()}
                        >
                            <Uploader handleDrop={(files) => !isViewOrReview && handleFileDrop(files, 'banner')}>
                                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                                    {bannerPreview ? (
                                        <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <span className="text-4xl mb-2">🌄</span>
                                            <p className="text-xs dark:text-secondary">Click or Drop Banner</p>
                                        </>
                                    )}
                                    {!isViewOrReview && (
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium">
                                            Change Image
                                        </div>
                                    )}
                                </div>
                            </Uploader>
                            <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, 'banner')} disabled={isViewOrReview} />
                        </div>
                    </div>

                    {/* Logo */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium dark:text-secondary">Logo Image</label>
                        <div
                            className={`w-full aspect-video bg-gray-100 dark:bg-surface-1 rounded-lg overflow-hidden border-2 border-dashed dark:border-border relative group ${!isViewOrReview ? 'cursor-pointer' : ''}`}
                            onClick={() => !isViewOrReview && logoInputRef.current?.click()}
                        >
                            <Uploader handleDrop={(files) => !isViewOrReview && handleFileDrop(files, 'logo')}>
                                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <>
                                            <span className="text-3xl mb-2">💎</span>
                                            <p className="text-xs dark:text-secondary">Click or Drop Logo</p>
                                        </>
                                    )}
                                    {!isViewOrReview && (
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium">
                                            Change Image
                                        </div>
                                    )}
                                </div>
                            </Uploader>
                            <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, 'logo')} disabled={isViewOrReview} />
                        </div>
                    </div>
                </div>

                {/* Right Column: Form Fields */}
                <div className="lg:col-span-2 bg-white dark:bg-surface-1 rounded-lg border dark:border-border shadow-lg p-6 flex flex-col gap-6 h-fit">
                    <div className="h-12">
                        <FloatInput label="Title" name="title" value={state.film.title} disable={isViewOrReview} onChange={handleChange} />
                    </div>
                    <div className="h-12">
                        <FloatInput label="Sub Title" name="subTitle" value={state.film.subTitle || ""} disable={isViewOrReview} onChange={handleChange} />
                    </div>
                    <div className="h-12">
                        <FloatInput label="Trailer URL" name="trailerURL" value={state.film.trailerURL || ""} disable={isViewOrReview} onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Released At - simplified as string for now to match UI, though type is Date */}
                        {/* In real app, date picker would be better */}
                        {/* Using text input for compatibility with previous code logic */}
                        <div className="h-12">
                            <FloatInput label="Number of Episodes" name="numberOfEpisodes" value={String(state.film.numberOfEpisodes || "")} disable={isViewOrReview} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="h-auto min-h-12 z-20 relative">
                        <AutoComplete<Interest>
                            label="Interests"
                            name="interests"
                            q={state.interestQ}
                            onQChange={(q) => setState(prev => ({ ...prev, interestQ: q }))}
                            suggestions={suggestions || []}
                            selected={state.film.interests}
                            onTagChange={(items) => updateFilmState({ interests: items })}
                            maxTags={10}
                            disable={isViewOrReview}
                        />
                    </div>

                    <div className="h-32">
                        <FloatTextarea label="Description" name="description" value={state.film.description || ""} disable={isViewOrReview} onChange={handleChange} />
                    </div>

                    <ActionButtons
                        mode={mode as any}
                        mutationPendings={{
                            draft: drafting,
                            submit: submitting,
                            approve: approving,
                            reject: rejecting,
                        }}
                        onSaveDraft={() => handleAction("draft")}
                        onSubmit={() => handleAction("submit")}
                        onCancel={() => router.back()}
                        onApprove={() => handleAction("approve")}
                        onReject={() => handleAction("reject")}
                    />
                </div>
            </div>
        </div>
    );
}
