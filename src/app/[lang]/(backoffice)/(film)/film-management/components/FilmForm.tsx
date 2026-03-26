"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import FloatInput from "../../../components/FloatInput";
import FloatTextarea from "../../../components/FloatTextarea";
import AutoComplete from "../../../components/AutoComplete";
import Uploader from "../../../../../components/Upload";
import { Film, Interest } from "@/app/feature/film";
import { createFilm, patchFilm } from "@/app/feature/film/action";
import {
  ActionButtons,
  ActionStatus,
} from "../../../components/ActionButtons/ActionButtons";
import useToast from "@/components/Toast";
import BackArrow from "@/assets/images/icons/back_arrow.svg";
import { config } from "@/app/config";

type Props = {
  film?: Film;
  suggestions: Interest[] | undefined;
};

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
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
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
  const [approving, startApproving] = useTransition();
  const [rejecting, startRejecting] = useTransition();

  // Refs for uploads
  const posterInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Ref to store original film data for diff checking
  const originalFilmRef = useRef<Film | null>(null);

  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("blob:") || url.startsWith("data:") || url.startsWith("http")) return url;
    return `${config.image_url_host}/${url}.image/webp.webp`;
  };

  // Initial previews (derived from film data or new uploads)
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string>(
    getImageUrl(film?.posterUrl || ""),
  );

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>(
    getImageUrl(film?.bannerUrl || ""),
  );

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(getImageUrl(film?.logoUrl || ""));

  const [posterMode, setPosterMode] = useState<"upload" | "url">("upload");
  const [bannerMode, setBannerMode] = useState<"upload" | "url">("upload");
  const [logoMode, setLogoMode] = useState<"upload" | "url">("upload");

  // Sync state with props if they change (re-validation/refetch)
  useEffect(() => {
    if (film) {
      originalFilmRef.current = film;
      setState((prev) => ({ ...prev, film: { ...film } }));
      setLogoPreview(getImageUrl(film.logoUrl || ""));
      setPosterPreview(getImageUrl(film.posterUrl || ""));
      setBannerPreview(getImageUrl(film.bannerUrl || ""));
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

  const updateState = (vals: Partial<Film>) => {
    setState(prev => ({ ...prev, film: { ...prev.film, ...vals } }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Handle number fields
    if (name === "numberOfEpisodes") {
      updateState({ [name]: parseInt(value) || 0 });
    } else {
      updateState({ [name]: value as any });
    }
  };

  const handleFileDrop = (files: FileList, type: 'poster' | 'banner' | 'logo') => {
    if (files && files[0]) {
      const file = files[0];

      // Validate file size
      const isLogo = type === 'logo';
      const limit = isLogo ? 2 * 1024 * 1024 : 5 * 1024 * 1024; // 2MB for Logo, 5MB for others

      if (file.size > limit) {
        toast.addToast("error", `${isLogo ? 'Thumbnail' : 'Gallery image'} must be smaller than ${isLogo ? '1-2 MB' : '5 MB'}`);
        return;
      }

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
        updateState({ logoUrl: fileName(file) }); // Mock setting URL to filename
      }
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "poster" | "banner" | "logo",
  ) => {
    if (e.target.files && e.target.files[0]) {
      handleFileDrop(e.target.files, type);
    }
  };

  const fileName = (f: File | null) => f?.name || "";

  const getChangeDiff = (original: Film, current: Film): Partial<Film> => {
    return (Object.keys(current) as Array<keyof Film>).reduce((acc, key) => {
      // ignore UI-only fields or read-only fields that shouldn't be patched
      if (key === 'interests' || key === 'slug') return acc;

      const val1 = original[key];
      const val2 = current[key];

      const isEmpty1 = val1 === null || val1 === undefined || val1 === "";
      const isEmpty2 = val2 === null || val2 === undefined || val2 === "";
      if (isEmpty1 && isEmpty2) return acc;

      if (Array.isArray(val1) && Array.isArray(val2)) {
        if (val1.length !== val2.length) {
          return { ...acc, [key]: val2 };
        }
        const sorted1 = [...val1].sort();
        const sorted2 = [...val2].sort();
        if (JSON.stringify(sorted1) !== JSON.stringify(sorted2)) {
          return { ...acc, [key]: val2 };
        }
        return acc;
      }

      if (JSON.stringify(val1) !== JSON.stringify(val2)) {
        return { ...acc, [key]: val2 };
      }
      return acc;
    }, {} as Partial<Film>);
  };

  const getPayload = (): Partial<Film> | Film => {
    const base: Film = {
      ...state.film,
      logoUrl: logoMode === "upload" && logoFile ? logoFile.name : state.film.logoUrl,
      posterUrl: posterMode === "upload" && posterFile ? posterFile.name : state.film.posterUrl,
      bannerUrl: bannerMode === "upload" && bannerFile ? bannerFile.name : state.film.bannerUrl,
    };


    if (mode === "create") return base;
    const original = originalFilmRef.current;
    if (!original) return base;

    return getChangeDiff(original, base);
  };

  const handleAction = (status: ActionStatus) => {
    const payload = getPayload();
    // Determine which transition to use based on status
    const performAction = async () => {
      try {
        let res;
        if (mode === "create") {
          if ((logoMode === "upload" && !logoFile) || (logoMode === "url" && !payload.logoUrl) || 
              (posterMode === "upload" && !posterFile) || (posterMode === "url" && !payload.posterUrl) || 
              (bannerMode === "upload" && !bannerFile) || (bannerMode === "url" && !payload.bannerUrl)) {
            toast.addToast("error", "Please provide all required images (upload or URL)");
            return;
          }
          res = await createFilm({ ...payload } as Film, logoMode === "upload" ? logoFile : null, posterMode === "upload" ? posterFile : null, bannerMode === "upload" ? bannerFile : null);
          if (res?.fieldErrors) {
            setFieldErrors(res.fieldErrors);
            return;
          }

        } else if (mode === "edit" || mode === "review") {
          if (Object.keys(payload).length === 0 && !logoFile && !posterFile && !bannerFile) {
            toast.addToast("error", "Please provide at least one field to update");
            return;
          }

          res = await patchFilm(state.film.id, payload, { 
            logo: logoMode === "upload" ? logoFile : null, 
            poster: posterMode === "upload" ? posterFile : null, 
            banner: bannerMode === "upload" ? bannerFile : null 
          });
          if (res?.fieldErrors) {
            setFieldErrors(res.fieldErrors);
            return;
          }
        }

        if (res?.successMsg) {
          toast.addToast("success", res.successMsg);
          router.back();
        }
      } catch (error: any) {
        toast.addToast("error", error.message || "An error occurred");
      }
    };

    if (status === "submit") startSubmitting(performAction);
    if (status === "approve") startApproving(performAction);
    if (status === "reject") startRejecting(performAction);
  };

  useEffect(() => {
    const slug = state.film.title.toLowerCase().replace(/\s+/g, "-");
    updateState({ slug });
  }, [state.film.title])

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
            {mode === "create"
              ? "Create New Film"
              : mode === "edit"
                ? `Edit Film - ${state.film.title}`
                : mode === "review"
                  ? `Review Film - ${state.film.title}`
                  : `View Film - ${state.film.title}`}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        {/* Left Column: Image Uploads */}
        <div className="flex flex-col gap-6">
          {/* Poster */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium dark:text-secondary">
                Poster Image
              </label>
              {!isViewOrReview && (
                <div className="flex bg-gray-100 dark:bg-surface-2 p-1 rounded-lg">
                  <button
                    type="button"
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${posterMode === "upload" ? "bg-white dark:bg-surface-1 shadow text-primary" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                    onClick={() => setPosterMode("upload")}
                  >Upload</button>
                  <button
                    type="button"
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${posterMode === "url" ? "bg-white dark:bg-surface-1 shadow text-primary" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                    onClick={() => setPosterMode("url")}
                  >URL</button>
                </div>
              )}
            </div>
            
            {posterMode === "upload" ? (
              <div
                className={`w-full aspect-[2/3] bg-gray-100 dark:bg-surface-1 rounded-lg overflow-hidden border-2 border-dashed dark:border-border relative group ${!isViewOrReview ? "cursor-pointer" : ""}`}
                onClick={() => !isViewOrReview && posterInputRef.current?.click()}
              >
                <Uploader
                  handleDrop={(files) =>
                    !isViewOrReview && handleFileDrop(files, "poster")
                  }
                >
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                    {posterPreview ? (
                      <img
                        src={posterPreview}
                        alt="Poster"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <span className="text-4xl mb-2">🖼️</span>
                        <p className="text-xs dark:text-secondary">
                          Click or Drop Poster
                        </p>
                      </>
                    )}
                    {!isViewOrReview && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium">
                        Change Image
                      </div>
                    )}
                  </div>
                </Uploader>
                <input
                  type="file"
                  ref={posterInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, "poster")}
                  disabled={isViewOrReview}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="h-12">
                  <FloatInput
                    label="Poster URL"
                    name="posterUrl"
                    value={state.film.posterUrl || ""}
                    disable={isViewOrReview}
                    onChange={(e) => {
                      const url = e.target.value;
                      updateState({ posterUrl: url });
                      setPosterPreview(getImageUrl(url));
                    }}
                  />
                </div>
                <div className="w-full aspect-[2/3] bg-gray-100 dark:bg-surface-1 rounded-lg overflow-hidden border dark:border-border relative flex items-center justify-center">
                  {posterPreview ? (
                    <img src={posterPreview} alt="Poster" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-gray-400">Preview Images</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Banner */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium dark:text-secondary">
                Banner Image
              </label>
              {!isViewOrReview && (
                <div className="flex bg-gray-100 dark:bg-surface-2 p-1 rounded-lg">
                  <button
                    type="button"
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${bannerMode === "upload" ? "bg-white dark:bg-surface-1 shadow text-primary" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                    onClick={() => setBannerMode("upload")}
                  >Upload</button>
                  <button
                    type="button"
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${bannerMode === "url" ? "bg-white dark:bg-surface-1 shadow text-primary" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                    onClick={() => setBannerMode("url")}
                  >URL</button>
                </div>
              )}
            </div>

            {bannerMode === "upload" ? (
              <div
                className={`w-full aspect-video bg-gray-100 dark:bg-surface-1 rounded-lg overflow-hidden border-2 border-dashed dark:border-border relative group ${!isViewOrReview ? "cursor-pointer" : ""}`}
                onClick={() => !isViewOrReview && bannerInputRef.current?.click()}
              >
                <Uploader
                  handleDrop={(files) =>
                    !isViewOrReview && handleFileDrop(files, "banner")
                  }
                >
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                    {bannerPreview ? (
                      <img
                        src={bannerPreview}
                        alt="Banner"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <span className="text-4xl mb-2">🌄</span>
                        <p className="text-xs dark:text-secondary">
                          Click or Drop Banner
                        </p>
                      </>
                    )}
                    {!isViewOrReview && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium">
                        Change Image
                      </div>
                    )}
                  </div>
                </Uploader>
                <input
                  type="file"
                  ref={bannerInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, "banner")}
                  disabled={isViewOrReview}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="h-12">
                  <FloatInput
                    label="Banner URL"
                    name="bannerUrl"
                    value={state.film.bannerUrl || ""}
                    disable={isViewOrReview}
                    onChange={(e) => {
                      const url = e.target.value;
                      updateState({ bannerUrl: url });
                      setBannerPreview(getImageUrl(url));
                    }}
                  />
                </div>
                <div className="w-full aspect-video bg-gray-100 dark:bg-surface-1 rounded-lg overflow-hidden border dark:border-border relative flex items-center justify-center">
                  {bannerPreview ? (
                    <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-gray-400">Preview Images</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Logo */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium dark:text-secondary">
                Logo Image
              </label>
              {!isViewOrReview && (
                <div className="flex bg-gray-100 dark:bg-surface-2 p-1 rounded-lg">
                  <button
                    type="button"
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${logoMode === "upload" ? "bg-white dark:bg-surface-1 shadow text-primary" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                    onClick={() => setLogoMode("upload")}
                  >Upload</button>
                  <button
                    type="button"
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${logoMode === "url" ? "bg-white dark:bg-surface-1 shadow text-primary" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                    onClick={() => setLogoMode("url")}
                  >URL</button>
                </div>
              )}
            </div>

            {logoMode === "upload" ? (
              <div
                className={`w-full aspect-video bg-gray-100 dark:bg-surface-1 rounded-lg overflow-hidden border-2 border-dashed dark:border-border relative group ${!isViewOrReview ? "cursor-pointer" : ""}`}
                onClick={() => !isViewOrReview && logoInputRef.current?.click()}
              >
                <Uploader
                  handleDrop={(files) =>
                    !isViewOrReview && handleFileDrop(files, "logo")
                  }
                >
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <>
                        <span className="text-3xl mb-2">💎</span>
                        <p className="text-xs dark:text-secondary">
                          Click or Drop Logo
                        </p>
                      </>
                    )}
                    {!isViewOrReview && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium">
                        Change Image
                      </div>
                    )}
                  </div>
                </Uploader>
                <input
                  type="file"
                  ref={logoInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, "logo")}
                  disabled={isViewOrReview}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="h-12">
                  <FloatInput
                    label="Logo URL"
                    name="logoUrl"
                    value={state.film.logoUrl || ""}
                    disable={isViewOrReview}
                    onChange={(e) => {
                      const url = e.target.value;
                      updateState({ logoUrl: url });
                      setLogoPreview(getImageUrl(url));
                    }}
                  />
                </div>
                <div className="w-full aspect-video bg-gray-100 dark:bg-surface-1 rounded-lg overflow-hidden border dark:border-border relative flex items-center justify-center">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <span className="text-xs text-gray-400">Preview Images</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Form Fields */}
        <div className="lg:col-span-2 bg-white dark:bg-surface-1 rounded-lg border dark:border-border shadow-lg p-6 flex flex-col gap-6 h-fit">
          <div className="flex flex-col gap-2">
            <div className="h-12">
              <FloatInput required label="Title" name="title" value={state.film.title} disable={isViewOrReview} onChange={handleChange} />
            </div>

            {fieldErrors["title"] && <span className="text-sm text-alert-0">{fieldErrors["title"]}</span>}
            <p
              className={`text-xs text-tertiary-0 w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-start mt-2 `}
            >
              <span className="font-bold text-secondary shrink-0">
                Slug:
              </span>{" "}

              {state.film.slug}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-12">
              <FloatInput required label="Sub Title" name="subTitle" value={state.film.subTitle || ""} disable={isViewOrReview} onChange={handleChange} />
            </div>
            {fieldErrors["subTitle"] && <span className="text-sm text-alert-0">{fieldErrors["subTitle"]}</span>}
          </div>
          <div className="flex flex-col gap-2">
            <FloatInput required label="Trailer URL" name="trailerURL" value={state.film.trailerURL || ""} disable={isViewOrReview} onChange={handleChange} />
            {fieldErrors["trailerURL"] && <span className="text-sm text-alert-0">{fieldErrors["trailerURL"]}</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Released At - simplified as string for now to match UI, though type is Date */}
            {/* In real app, date picker would be better */}
            {/* Using text input for compatibility with previous code logic */}
            <div className="h-12">
              <FloatInput type="number" label="Number of Episodes" name="numberOfEpisodes" required value={String(state.film.numberOfEpisodes || "0")} disable={isViewOrReview} onChange={handleChange} />
              {fieldErrors["numberOfEpisodes"] && <span className="text-sm text-alert">{fieldErrors["numberOfEpisodes"]}</span>}
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
              onTagChange={(items) => updateState({ interestIds: items.map(item => item.id), interests: items })}
              maxTags={10}
              disable={isViewOrReview}
              required
            />
            {fieldErrors["interestIds"] && <span className="text-sm text-alert-0">{fieldErrors["interestIds"]}</span>}
          </div>

          <div className="h-48">
            <FloatTextarea label="Description" name="description" value={state.film.description || ""} disable={isViewOrReview} onChange={handleChange} />
            {fieldErrors["description"] && <span className="text-sm text-alert-0">{fieldErrors["description"]}</span>}
          </div>

          <ActionButtons
            mode={mode as any}
            modeActionConfig={{
              create: ["submit"],
              edit: ["submit"],
              review: ["approve", "reject"],
            }}
            buttonAppearanceConfig={{
              submit: {
                label: mode === "create" ? "Create Film" : "Update Film",
                waitingLabel: mode === "create" ? "Creating..." : "Updating...",
                className: "dark:bg-accent-0 hover:dark:bg-accent-1",
              },
            }}
            mutationPendings={{
              submit: submitting,
              approve: approving,
              reject: rejecting,
            }}
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
