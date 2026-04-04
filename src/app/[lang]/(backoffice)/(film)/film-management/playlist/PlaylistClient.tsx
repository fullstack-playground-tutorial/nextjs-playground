"use client";

import { useMemo, useState, useEffect } from "react";
import FloatInput from "@/app/[lang]/(backoffice)/components/FloatInput";
import FloatTextarea from "@/app/[lang]/(backoffice)/components/FloatTextarea";
import FloatDateInput from "@/app/[lang]/(backoffice)/components/FloatDateInput/FloatDateInput";
import { Episode } from "@/app/feature/episode";
import {
  createEpisode,
  updateEpisode,
  reorderEpisode,
  deleteEpisode,
} from "@/app/feature/episode/action";
import { DurationInput } from "../../../components/DurationInput";
import { Slugify } from "@/app/utils/string";
import useToast from "@/components/Toast";
import { useRouter, useParams } from "next/navigation";
import BackArrow from "@/assets/images/icons/back_arrow.svg";

const STATUS_LABELS = {
  upcoming: "Sắp chiếu",
  airing: "Đang chiếu",
  unknown: "Chưa xác định",
} as const;

type NewEpisode = Omit<Episode, "id" | "episodeNo"> & {
  publishedAtStr: string;
};

type EditDraft = Episode & {
  publishedAtStr: string;
};

const emptyNewEpisode: NewEpisode = {
  title: "",
  subTitle: "",
  duration: 0,
  videoUrl: "",
  description: "",
  filmId: "",
  publishedAtStr: "",
};

function parseDate(value: string): Date | null {
  const parsed = new Date(value.replace(" ", "T"));
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
}

function getStatusLabel(publishedAt?: Date | string | null) {
  if (!publishedAt) {
    return STATUS_LABELS.unknown;
  }
  const date =
    typeof publishedAt === "string" ? new Date(publishedAt) : publishedAt;
  return date.getTime() > Date.now()
    ? STATUS_LABELS.upcoming
    : STATUS_LABELS.airing;
}

function getCurrentEpisode(episodes: Episode[]) {
  const now = Date.now();
  const withDate = episodes
    .map((episode) => {
      const time = episode.publishedAt
        ? typeof episode.publishedAt === "string"
          ? new Date(episode.publishedAt).getTime()
          : episode.publishedAt.getTime()
        : undefined;
      return { episode, time };
    })
    .filter((item) => item.time !== undefined) as {
    episode: Episode;
    time: number;
  }[];

  if (withDate.length === 0) {
    return null;
  }

  const past = withDate.filter((item) => item.time <= now);
  if (past.length > 0) {
    return past.sort((a, b) => b.time - a.time)[0].episode;
  }

  return withDate.sort((a, b) => a.time - b.time)[0].episode;
}

interface Props {
  playlistName: string;
  episodes: Episode[];
  playlistId: string;
}

interface InternalState {
  episodes: Episode[];
  newEpisode: NewEpisode;
  editingId: string | null;
  editDraft: EditDraft | null;
  errorMessage: string;
  draggingId: string | null;
}

function formatDuration(seconds?: number) {
  if (!seconds || seconds <= 0) return "không xác định";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function PlaylistClient({
  playlistName,
  episodes,
  playlistId,
}: Props) {
  const toast = useToast();
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang as string;
  const [state, setState] = useState<InternalState>({
    episodes: episodes,
    newEpisode: {
      ...emptyNewEpisode,
      filmId: playlistId,
    },
    editingId: null,
    editDraft: null,
    errorMessage: "",
    draggingId: null,
  });
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      episodes: episodes,
    }));
  }, [episodes]);

  const stats = useMemo(() => {
    const total = state.episodes.length;
    const upcoming = state.episodes.filter(
      (episode) =>
        getStatusLabel(episode.publishedAt) === STATUS_LABELS.upcoming,
    ).length;
    const airing = state.episodes.filter(
      (episode) => getStatusLabel(episode.publishedAt) === STATUS_LABELS.airing,
    ).length;
    return { total, upcoming, airing };
  }, [state.episodes]);

  const currentEpisode = useMemo(
    () => getCurrentEpisode(state.episodes),
    [state.episodes],
  );

  async function handleAddEpisode() {
    const duration = state.newEpisode.duration;
    const publishedAt = parseDate(state.newEpisode.publishedAtStr) || null;

    const newEp: Episode = {
      id: "",
      episodeNo: state.episodes.length + 1,
      title: state.newEpisode.title?.trim(),
      subTitle: state.newEpisode.subTitle?.trim(),
      slug: Slugify(state.newEpisode.title || ""),
      duration: duration,
      publishedAt: publishedAt,
      videoUrl: state.newEpisode.videoUrl?.trim(),
      description: state.newEpisode.description?.trim() || "",
      filmId: state.newEpisode.filmId,
    };

    setIsPending(true);
    try {
      const res = await createEpisode(playlistId, newEp);
      if (res?.fieldErrors || res?.errMsg) {
        setState((prev) => ({
          ...prev,
          errorMessage: res.errMsg || "Có lỗi xảy ra khi tạo tập.",
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        newEpisode: {
          ...emptyNewEpisode,
          filmId: playlistId,
        },
        errorMessage: "",
      }));
      toast.addToast("success", "Thêm tập thành công");
    } catch (e) {
      toast.addToast("error", "Lỗi hệ thống khi thêm tập");
    } finally {
      setIsPending(false);
    }
  }

  async function handleDelete(id: string) {
    setIsPending(true);
    try {
      const res = await deleteEpisode(id, playlistId);
      if (res?.fieldErrors || res?.errMsg) {
        toast.addToast("error", res.errMsg || "Có lỗi xảy ra khi xóa tập.");
        return;
      }
      toast.addToast("success", "Xóa tập thành công");
    } catch (e) {
      toast.addToast("error", "Lỗi hệ thống khi xóa tập");
    } finally {
      setIsPending(false);
    }
  }

  function startEdit(episode: Episode) {
    const pubAt = episode.publishedAt
      ? typeof episode.publishedAt === "string"
        ? new Date(episode.publishedAt)
        : episode.publishedAt
      : null;
    setState((prev) => ({
      ...prev,
      editingId: episode.id,
      editDraft: {
        ...episode,
        publishedAtStr: pubAt ? pubAt.toISOString().slice(0, 16) : "",
        duration: episode.duration,
      },
    }));
  }

  function cancelEdit() {
    setState((prev) => ({
      ...prev,
      editingId: null,
      editDraft: null,
    }));
  }

  async function saveEdit() {
    if (!state.editDraft) {
      return;
    }
    if (!state.editDraft.title?.trim()) {
      return;
    }
    const duration = state.editDraft.duration;
    const publishedAt = parseDate(state.editDraft.publishedAtStr) || null;

    const epDataToUpdate: Episode = {
      ...state.editDraft,
      title: state.editDraft.title?.trim(),
      subTitle: state.editDraft.subTitle?.trim(),
      duration: duration,
      publishedAt: publishedAt,
      videoUrl: state.editDraft.videoUrl?.trim(),
      description: state.editDraft.description?.trim() || "",
    };

    setIsPending(true);
    try {
      const res = await updateEpisode(
        state.editDraft.id,
        state.editDraft.filmId,
        epDataToUpdate,
      );
      if (res?.fieldErrors || res?.errMsg) {
        setState((prev) => ({
          ...prev,
          errorMessage: res.errMsg || "Có lỗi xảy ra khi cập nhật tập.",
        }));
        return;
      }

      cancelEdit();
    } catch (e) {
      toast.addToast("error", "Lỗi hệ thống khi cập nhật tập");
    } finally {
      setIsPending(false);
    }
  }

  async function reorderEpisodes(sourceId: string, targetId: string) {
    if (isPending || sourceId === targetId) {
      return;
    }

    const previousEpisodes = [...state.episodes];

    const updatedEpisodes = [...state.episodes];
    const sourceIndex = updatedEpisodes.findIndex((e) => e.id === sourceId);
    const targetIndex = updatedEpisodes.findIndex((e) => e.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const [moved] = updatedEpisodes.splice(sourceIndex, 1);
    const insertIndex =
      sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
    updatedEpisodes.splice(insertIndex, 0, moved);

    // Update episodeNo based on new order
    const reordered = updatedEpisodes.map((ep, idx) => ({
      ...ep,
      episodeNo: idx + 1,
    }));

    setState((prev) => ({
      ...prev,
      episodes: reordered,
    }));

    const newIndex = insertIndex;
    const prevId = newIndex > 0 ? reordered[newIndex - 1]?.id : undefined;

    const nextId =
      newIndex < reordered.length - 1 ? reordered[newIndex + 1]?.id : undefined;
    setIsPending(true);

    try {
      const res = await reorderEpisode(sourceId, moved.filmId, {
        prevId,
        nextId,
      });

      if (res?.fieldErrors || res?.errMsg) {
        toast.addToast(
          "error",
          res.errMsg || "Có lỗi xảy ra khi đổi vị trí tập.",
        );
        setState((prev) => ({
          ...prev,
          episodes: previousEpisodes,
        }));
      }
    } catch (e) {
      toast.addToast("error", "Lỗi chuyển vị trí tập.");
      setState((prev) => ({
        ...prev,
        episodes: previousEpisodes,
      }));
    } finally {
      setIsPending(false);
    }
  }

  function handleDragStart(id: string, event: React.DragEvent<HTMLDivElement>) {
    if (isPending) {
      event.preventDefault();
      return;
    }
    setState((prev) => ({
      ...prev,
      draggingId: id,
    }));
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", id);
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  function handleDrop(
    targetId: string,
    event: React.DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault();
    if (isPending) return;
    const sourceId = event.dataTransfer.getData("text/plain");
    if (!sourceId) {
      return;
    }
    reorderEpisodes(sourceId, targetId);
    setState((prev) => ({
      ...prev,
      draggingId: null,
    }));
  }

  function handleDragEnd() {
    setState((prev) => ({
      ...prev,
      draggingId: null,
    }));
  }

  return (
    <div className="min-h-screen bg-surface-0 text-primary animate-in fade-in duration-700">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,183,77,0.18),_transparent_70%)]" />
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-8 relative">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col">
                <button
                  onClick={() => router.push(`/${lang}/film-management`)}
                  className="group flex items-center gap-2 mb-6 text-secondary hover:text-accent-0 transition-all w-fit"
                >
                  <div className="rounded-full size-10 flex items-center cursor-pointer justify-center bg-surface-1/80 border border-border/30 group-hover:border-accent-0/50 group-hover:bg-accent-0/10 transition shadow-sm">
                    <BackArrow className="size-4 dark:fill-accent-0 group-hover:dark:fill-accent-0 transition-transform group-hover:-translate-x-1" />
                  </div>
                  <span className="text-sm font-semibold uppercase tracking-wider">
                    Quay lại phim
                  </span>
                </button>

                <div className="flex items-center gap-2 mb-2">
                  <div className="h-5 w-1 bg-accent-0 rounded-full"></div>
                  <p className="text-xs uppercase tracking-[0.4em] text-accent-0 font-bold">
                    Quản lý danh sách tập
                  </p>
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-primary tracking-tight leading-tight">
                  {playlistName}
                </h1>
                <p className="text-secondary mt-3 max-w-2xl text-lg opacity-80">
                  Sắp xếp quy trình phát hành, cập nhật nội dung và quản lý kho
                  phim của bạn một cách chuyên nghiệp.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="group rounded-3xl bg-surface-1/40 backdrop-blur-md border border-border/20 p-6 shadow-sm hover:border-accent-0/30 transition-all duration-300">
                <p className="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold mb-1 opacity-70">
                  Tổng số tập
                </p>
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-black text-primary group-hover:text-accent-0 transition-colors">
                    {stats.total}
                  </p>
                  <p className="text-xs text-secondary mb-1.5 font-medium">
                    phần
                  </p>
                </div>
              </div>
              <div className="group rounded-3xl bg-surface-1/40 backdrop-blur-md border border-border/20 p-6 shadow-sm hover:border-accent-0/30 transition-all duration-300">
                <p className="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold mb-1 opacity-70">
                  Sắp phát hành
                </p>
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-black text-primary group-hover:text-accent-0 transition-colors">
                    {stats.upcoming}
                  </p>
                  <p className="text-xs text-secondary mb-1.5 font-medium">
                    tập
                  </p>
                </div>
              </div>
              <div className="group rounded-3xl bg-surface-1/40 backdrop-blur-md border border-border/20 p-6 shadow-sm hover:border-accent-0/30 transition-all duration-300">
                <p className="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold mb-1 opacity-70">
                  Đã công chiếu
                </p>
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-black text-primary group-hover:text-accent-0 transition-colors">
                    {stats.airing}
                  </p>
                  <p className="text-xs text-secondary mb-1.5 font-medium">
                    tập
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-16 grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
        <section className="rounded-[28px] border border-border/40 bg-surface-1/40 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-primary">Danh sách tập</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-secondary">
              {isPending ? (
                <span className="flex items-center gap-2 text-accent-0">
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                "Kéo thả để sắp xếp"
              )}
            </span>
          </div>

          <div
            className={`flex flex-col gap-5 transition-opacity duration-200 ${isPending ? "opacity-60 pointer-events-none" : ""}`}
          >
            {state.episodes.map((episode, idx) => {
              const statusLabel = getStatusLabel(episode.publishedAt);
              const isEditing = state.editingId === episode.id;
              const isDragging = state.draggingId === episode.id;

              return (
                <div
                  key={episode.id}
                  draggable
                  onDragStart={(event) => handleDragStart(episode.id, event)}
                  onDragOver={handleDragOver}
                  onDrop={(event) => handleDrop(episode.id, event)}
                  onDragEnd={handleDragEnd}
                  className={`group/item rounded-[24px] border p-5 transition-all duration-300 cursor-grab ${
                    isDragging
                      ? "border-accent-0 bg-accent-0/10 scale-[1.02] shadow-2xl ring-2 ring-accent-0/20"
                      : "border-border/10 bg-surface-0 hover:bg-surface-1/50 hover:border-border/30 hover:shadow-lg"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-lg bg-surface-1 text-primary">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-primary">
                            {episode.title}
                          </h3>
                          <span className="text-[10px] uppercase tracking-[0.2em] text-accent-0 font-semibold">
                            {statusLabel}
                          </span>
                        </div>
                        <p className="text-sm text-secondary mt-1">
                          {episode.subTitle} •{" "}
                          {formatDuration(episode.duration)} •{" "}
                          <span>
                            {!episode.publishedAt ? (
                              "chưa xác định"
                            ) : isMounted ? (
                              typeof episode.publishedAt === "string" ? (
                                new Date(episode.publishedAt).toLocaleString()
                              ) : (
                                episode.publishedAt.toLocaleString()
                              )
                            ) : (
                              <span className="opacity-0">placeholder</span>
                            )}
                          </span>
                        </p>
                        {episode.videoUrl && (
                          <p className="text-xs text-secondary mt-1">
                            Link: {episode.videoUrl}
                          </p>
                        )}
                        {episode.description && (
                          <p className="text-xs text-secondary mt-2">
                            {episode.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-surface-1 border border-border/20 hover:border-accent-0/40 hover:text-accent-0 transition-all active:scale-95"
                        onClick={() => startEdit(episode)}
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-red-500/10 text-red-400 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all active:scale-95"
                        onClick={() => handleDelete(episode.id)}
                      >
                        Xóa tập
                      </button>
                    </div>
                  </div>

                  {isEditing && state.editDraft && (
                    <div className="mt-4 rounded-2xl bg-surface-1/60 border border-border/30 p-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="h-12">
                          <FloatInput
                            name="editTitle"
                            label="Tiêu đề tập"
                            value={state.editDraft.title}
                            disabled={false}
                            required
                            onChange={(event) =>
                              setState((prev) => ({
                                ...prev,
                                editDraft: prev.editDraft
                                  ? {
                                      ...prev.editDraft,
                                      title: event.target.value,
                                    }
                                  : null,
                              }))
                            }
                          />
                        </div>
                        <div className="h-12">
                          <FloatInput
                            name="editSubTitle"
                            label="Tiêu đề phụ"
                            value={state.editDraft.subTitle}
                            disabled={false}
                            onChange={(event) =>
                              setState((prev) => ({
                                ...prev,
                                editDraft: prev.editDraft
                                  ? {
                                      ...prev.editDraft,
                                      subTitle: event.target.value,
                                    }
                                  : null,
                              }))
                            }
                          />
                        </div>
                        <div className="h-12">
                          <DurationInput
                            name="editDuration"
                            label="Thời lượng"
                            duration={state.editDraft.duration}
                            disabled={false}
                            onChange={(_, d) =>
                              setState((prev) => ({
                                ...prev,
                                editDraft: prev.editDraft
                                  ? {
                                      ...prev.editDraft,
                                      duration: d,
                                    }
                                  : null,
                              }))
                            }
                          />
                        </div>
                        <div className="h-12">
                          <FloatDateInput
                            name="editPublishedAt"
                            label="Ngày chiếu"
                            value={state.editDraft.publishedAtStr}
                            disabled={false}
                            onChange={(event) =>
                              setState((prev) => ({
                                ...prev,
                                editDraft: prev.editDraft
                                  ? {
                                      ...prev.editDraft,
                                      publishedAtStr: event.target.value,
                                    }
                                  : null,
                              }))
                            }
                          />
                        </div>
                        <div className="h-12 md:col-span-2">
                          <FloatInput
                            name="editVideoUrl"
                            label="Link phim"
                            value={state.editDraft.videoUrl ?? ""}
                            disabled={false}
                            required
                            onChange={(event) =>
                              setState((prev) => ({
                                ...prev,
                                editDraft: prev.editDraft
                                  ? {
                                      ...prev.editDraft,
                                      videoUrl: event.target.value,
                                    }
                                  : null,
                              }))
                            }
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="h-24">
                          <FloatTextarea
                            name="editDescription"
                            label="Mô tả"
                            value={state.editDraft.description ?? ""}
                            disable={false}
                            onChange={(event) =>
                              setState((prev) => ({
                                ...prev,
                                editDraft: prev.editDraft
                                  ? {
                                      ...prev.editDraft,
                                      description: event.target.value,
                                    }
                                  : null,
                              }))
                            }
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 mt-4">
                        <button
                          type="button"
                          className="px-4 py-2 rounded-xl bg-accent-0 text-white text-sm font-semibold disabled:opacity-50"
                          onClick={saveEdit}
                          disabled={isPending}
                        >
                          {isPending ? "Đang lưu..." : "Lưu"}
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 rounded-xl bg-surface-1 text-sm font-semibold"
                          onClick={cancelEdit}
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div className="rounded-[28px] border border-border/40 bg-surface-1/40 p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-6 w-1.5 bg-accent-0 rounded-full"></div>
              <h2 className="text-2xl font-black text-primary">Thêm tập mới</h2>
            </div>
            <div className="grid gap-5">
              <div className="h-12">
                <FloatInput
                  name="newTitle"
                  label="Tiêu đề tập"
                  value={state.newEpisode.title}
                  disabled={false}
                  required
                  onChange={(event) =>
                    setState({
                      ...state,
                      newEpisode: {
                        ...state.newEpisode,
                        title: event.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="h-12">
                <FloatInput
                  name="newSubTitle"
                  label="Tiêu đề phụ"
                  value={state.newEpisode.subTitle}
                  disabled={false}
                  onChange={(event) =>
                    setState({
                      ...state,
                      newEpisode: {
                        ...state.newEpisode,
                        subTitle: event.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="h-12">
                <DurationInput
                  name="newDuration"
                  label="Thời lượng"
                  duration={state.newEpisode.duration}
                  disabled={false}
                  onChange={(_, d) =>
                    setState({
                      ...state,
                      newEpisode: {
                        ...state.newEpisode,
                        duration: d,
                      },
                    })
                  }
                />
              </div>
              <div className="h-12">
                <FloatDateInput
                  name="newPublishedAt"
                  label="Ngày chiếu"
                  value={state.newEpisode.publishedAtStr}
                  disabled={false}
                  onChange={(event) =>
                    setState({
                      ...state,
                      newEpisode: {
                        ...state.newEpisode,
                        publishedAtStr: event.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="h-12">
                <FloatInput
                  name="newVideoUrl"
                  label="Link phim"
                  value={state.newEpisode.videoUrl ?? ""}
                  disabled={false}
                  required
                  onChange={(event) =>
                    setState({
                      ...state,
                      newEpisode: {
                        ...state.newEpisode,
                        videoUrl: event.target.value,
                      },
                    })
                  }
                />
              </div>

              <div className="h-24">
                <FloatTextarea
                  name="newDescription"
                  label="Mô tả"
                  value={state.newEpisode.description ?? ""}
                  disable={false}
                  onChange={(event) =>
                    setState({
                      ...state,
                      newEpisode: {
                        ...state.newEpisode,
                        description: event.target.value,
                      },
                    })
                  }
                />
              </div>

              {state.errorMessage && (
                <p className="text-sm text-alert-0">{state.errorMessage}</p>
              )}

              <button
                type="button"
                className="mt-2 px-5 py-3 rounded-2xl bg-accent-0 text-white text-sm font-semibold hover:-translate-y-0.5 transition disabled:opacity-50 disabled:hover:translate-y-0"
                onClick={handleAddEpisode}
                disabled={isPending}
              >
                {isPending ? "Đang xử lý..." : "Thêm tập"}
              </button>
              <p className="text-xs text-secondary">
                Bắt buộc có link phim. Status tự động tính theo thời điểm phát
                hành.
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-border/40 bg-surface-1/40 p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-primary">
              Tập đang chiếu
            </h3>
            {currentEpisode ? (
              <div className="mt-4 rounded-2xl bg-surface-0/70 border border-border/30 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-secondary">
                      Tập {currentEpisode.episodeNo}
                    </p>
                    <p className="text-lg font-semibold text-primary">
                      {currentEpisode.title}
                    </p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-accent-0">
                    {getStatusLabel(currentEpisode.publishedAt)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-secondary mt-4">Chưa có tập.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
