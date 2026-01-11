"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import FloatInput from "../../../components/FloatInput";
import FloatTextarea from "../../../components/FloatTextarea";
import AutoComplete, { AutoCompeleteItem } from "../../../components/AutoComplete";
import Uploader from "../../../../../components/Upload"; // Adjusted path
import Image from "next/image";
// import { Film } from "@/app/types/film"; // Assuming we might want to type this later, but for now using local state

// Mock Interests for AutoComplete (formerly Tags)
const MOCK_INTERESTS = [
    { id: "1", title: "Sci-Fi" },
    { id: "2", title: "Action" },
    { id: "3", title: "Drama" },
    { id: "4", title: "Adventure" },
    { id: "5", title: "Thriller" },
    { id: "6", title: "Comedy" },
    { id: "7", title: "Romance" },
];

export default function CreateFilmPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        subTitle: "",
        description: "",
        numberOfEpisodes: "", // Input usually handles strings, parsed later
        trailerUrl: "",
        releasedAt: "",
    });

    const [selectedInterests, setSelectedInterests] = useState<AutoCompeleteItem<any>[]>([]);
    const [interestQuery, setInterestQuery] = useState("");

    // Image Upload State
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [posterPreview, setPosterPreview] = useState<string>("");
    const posterInputRef = useRef<HTMLInputElement>(null);

    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string>("");
    const bannerInputRef = useRef<HTMLInputElement>(null);

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>("");
    const logoInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
            }
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'poster' | 'banner' | 'logo') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
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
            }
        }
    };

    const handleSave = () => {
        console.log("Saving film:", {
            ...formData,
            numberOfEpisodes: parseInt(formData.numberOfEpisodes) || 0,
            interests: selectedInterests,
            poster: posterFile?.name,
            banner: bannerFile?.name,
            logo: logoFile?.name
        });
        // Mock save delay
        setTimeout(() => {
            router.back();
        }, 500);
    };

    return (
        <div className="p-6 min-h-screen dark:text-primary flex flex-col items-center">
            <div className="w-full max-w-5xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold dark:text-accent-0 text-shadow-lg">
                        Create New Film
                    </h1>
                    <button
                        onClick={() => router.back()}
                        className="text-sm dark:text-secondary hover:underline"
                    >
                        Back to List
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Image Uploads */}
                    <div className="flex flex-col gap-6">

                        {/* Poster Upload */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium dark:text-secondary">Poster Image</label>
                            <div
                                className="w-full aspect-[2/3] bg-gray-100 dark:bg-surface-1 rounded-lg overflow-hidden border-2 border-dashed dark:border-border cursor-pointer relative group"
                                onClick={() => posterInputRef.current?.click()}
                            >
                                <Uploader handleDrop={(files) => handleFileDrop(files, 'poster')}>
                                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                                        {posterPreview ? (
                                            <img
                                                src={posterPreview}
                                                alt="Poster Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <>
                                                <span className="text-4xl mb-2">🖼️</span>
                                                <p className="text-xs dark:text-secondary">Click or Drop Poster</p>
                                            </>
                                        )}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium">
                                            Change Image
                                        </div>
                                    </div>
                                </Uploader>
                                <input
                                    type="file"
                                    ref={posterInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleFileSelect(e, 'poster')}
                                />
                            </div>
                        </div>

                        {/* Banner Upload */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium dark:text-secondary">Banner Image</label>
                            <div
                                className="w-full aspect-video bg-gray-100 dark:bg-surface-1 rounded-lg overflow-hidden border-2 border-dashed dark:border-border cursor-pointer relative group"
                                onClick={() => bannerInputRef.current?.click()}
                            >
                                <Uploader handleDrop={(files) => handleFileDrop(files, 'banner')}>
                                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                                        {bannerPreview ? (
                                            <img
                                                src={bannerPreview}
                                                alt="Banner Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <>
                                                <span className="text-4xl mb-2">🌄</span>
                                                <p className="text-xs dark:text-secondary">Click or Drop Banner</p>
                                            </>
                                        )}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium">
                                            Change Image
                                        </div>
                                    </div>
                                </Uploader>
                                <input
                                    type="file"
                                    ref={bannerInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleFileSelect(e, 'banner')}
                                />
                            </div>
                        </div>

                        {/* Logo Upload */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium dark:text-secondary">Logo Image</label>
                            <div
                                className="w-full aspect-video bg-gray-100 dark:bg-surface-1 rounded-lg overflow-hidden border-2 border-dashed dark:border-border cursor-pointer relative group"
                                onClick={() => logoInputRef.current?.click()}
                            >
                                <Uploader handleDrop={(files) => handleFileDrop(files, 'logo')}>
                                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                                        {logoPreview ? (
                                            <img
                                                src={logoPreview}
                                                alt="Logo Preview"
                                                className="w-full h-full object-contain p-2"
                                            />
                                        ) : (
                                            <>
                                                <span className="text-3xl mb-2">💎</span>
                                                <p className="text-xs dark:text-secondary">Click or Drop Logo</p>
                                            </>
                                        )}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium">
                                            Change Image
                                        </div>
                                    </div>
                                </Uploader>
                                <input
                                    type="file"
                                    ref={logoInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleFileSelect(e, 'logo')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form Fields */}
                    <div className="lg:col-span-2 bg-white dark:bg-surface-1 rounded-lg border dark:border-border shadow-lg p-6 flex flex-col gap-6 h-fit">

                        {/* Title */}
                        <div className="h-12">
                            <FloatInput
                                label="Title"
                                name="title"
                                value={formData.title}
                                disable={false}
                                onChange={handleChange}
                            />
                        </div>

                        {/* SubTitle */}
                        <div className="h-12">
                            <FloatInput
                                label="Sub Title"
                                name="subTitle"
                                value={formData.subTitle}
                                disable={false}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Trailer URL */}
                        <div className="h-12">
                            <FloatInput
                                label="Trailer URL"
                                name="trailerUrl"
                                value={formData.trailerUrl}
                                disable={false}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Released At */}
                            <div className="h-12">
                                <FloatInput
                                    label="Released At (YYYY-MM-DD)"
                                    name="releasedAt"
                                    value={formData.releasedAt}
                                    disable={false}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Number of Episodes */}
                            <div className="h-12">
                                <FloatInput
                                    label="Number of Episodes"
                                    name="numberOfEpisodes"
                                    value={String(formData.numberOfEpisodes)}
                                    disable={false}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Interests (formerly Tags) */}
                        <div className="h-auto min-h-12 z-20 relative">
                            <AutoComplete
                                label="Interests"
                                name="interests"
                                q={interestQuery}
                                onQChange={setInterestQuery}
                                suggestions={MOCK_INTERESTS}
                                selected={selectedInterests}
                                onTagChange={setSelectedInterests}
                                maxTags={10}
                                disable={false}
                            />
                        </div>

                        {/* Description */}
                        <div className="h-32">
                            <FloatTextarea
                                label="Description"
                                name="description"
                                value={formData.description}
                                disable={false}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t dark:border-border">
                            <button
                                onClick={() => router.back()}
                                className="px-4 py-2 rounded text-gray-600 dark:text-secondary hover:bg-gray-100 dark:hover:bg-surface-2 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 rounded bg-accent-0 text-white font-medium hover:bg-accent-1 shadow hover:shadow-lg transition transform active:scale-95"
                            >
                                Save Film
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
