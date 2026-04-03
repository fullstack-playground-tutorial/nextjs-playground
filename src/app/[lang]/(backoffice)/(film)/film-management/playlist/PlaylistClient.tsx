"use client";

import { useMemo, useState, useEffect } from "react";
import FloatInput from "@/app/[lang]/(backoffice)/components/FloatInput";
import FloatTextarea from "@/app/[lang]/(backoffice)/components/FloatTextarea";
import FloatDateInput from "@/app/[lang]/(backoffice)/components/FloatDateInput/FloatDateInput";
import { Episode } from "@/app/feature/episode";
import { createEpisode, updateEpisode } from "@/app/feature/episode/action";
import { DurationInput } from "../../../components/DurationInput";
import { Slugify } from "@/app/utils/string";
import useToast from "@/components/Toast";

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

function getStatusLabel(publishedAt?: Date | string) {
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

export default function PlaylistClient({
  playlistName,
  episodes,
  playlistId,
}: Props) {
  const [state, setState] = useState<InternalState>({
    episodes: episodes,
    newEpisode: {
      ...emptyNewEpisode,
      filmId: episodes.length > 0 ? episodes[0].filmId : "",
    },
    editingId: null,
    editDraft: null,
    errorMessage: "",
    draggingId: null,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toast = useToast();

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
    if (!state.newEpisode.title?.trim()) {
      setErrorMessage("Cần nhập tiêu đề tập.");
      toast.addToast;
      return;
    }

    if (!state.newEpisode.publishedAtStr.trim()) {
      setErrorMessage("Cần nhập thời gian phát hành.");
      return;
    }

    if (!state.newEpisode.videoUrl?.trim()) {
      setErrorMessage("Cần nhập link phim.");
      return;
    }

    const duration = state.newEpisode.duration;
    const publishedAt = parseDate(state.newEpisode.publishedAtStr) || undefined;

    const newEp: Episode = {
      id: "",
      episodeNo: state.episodes.length + 1,
      title: state.newEpisode.title?.trim(),
      subTitle: state.newEpisode.subTitle?.trim(),
      slug: Slugify(state.newEpisode.title),
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
        setErrorMessage(res.errMsg || "Có lỗi xảy ra khi tạo tập.");
        return;
      }

      setState((prev) => ({
        ...prev,
        episodes: [
          ...prev.episodes,
          {
            ...newEp,
            id: `ep-${Date.now()}`,
          },
        ],
        newEpisode: {
          ...emptyNewEpisode,
          filmId: prev.newEpisode.filmId,
        },
      }));
    } catch (e) {
      toast.addToast("error", "Lỗi hệ thống khi thêm tập");
    } finally {
      setIsPending(false);
    }
  }

  function handleDelete(id: string) {
    setState((prev) => ({
      ...prev,
      episodes: prev.episodes.filter((episode) => episode.id !== id),
    }));
  }

  function startEdit(episode: Episode) {
    setEditingId(episode.id);
    const pubAt = episode.publishedAt
      ? typeof episode.publishedAt === "string"
        ? new Date(episode.publishedAt)
        : episode.publishedAt
      : null;
    setEditDraft({
      ...episode,
      publishedAtStr: pubAt
        ? pubAt.toISOString().slice(0, 16)
        : "",
      duration: episode.duration,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft(null);
  }

  async function saveEdit() {
    if (!editDraft) {
      return;
    }
    if (!editDraft.title?.trim()) {
      return;
    }
    if (!editDraft.publishedAtStr.trim()) {
      return;
    }
    if (!editDraft.videoUrl?.trim()) {
      return;
    }

    const duration = editDraft.duration;
    const publishedAt = parseDate(editDraft.publishedAtStr) || undefined;

    const epDataToUpdate: Episode = {
      ...editDraft,
      title: editDraft.title?.trim(),
      subTitle: editDraft.subTitle?.trim(),
      duration: duration,
      publishedAt: publishedAt,
      videoUrl: editDraft.videoUrl?.trim(),
      description: editDraft.description?.trim() || "",
    };

    setIsPending(true);
    try {
      const res = await updateEpisode(
        editDraft.id,
        editDraft.filmId,
        epDataToUpdate,
      );
      if (res?.fieldErrors || res?.errMsg) {
        setErrorMessage(res.errMsg || "Có lỗi xảy ra khi cập nhật tập.");
        return;
      }

      setState((prev) => ({
        ...prev,
        episodes: prev.episodes.map((episode) =>
          episode.id === editDraft.id ? epDataToUpdate : episode,
        ),
      }));

      cancelEdit();
    } catch (e) {
      toast.addToast("error", "Lỗi hệ thống khi cập nhật tập");
    } finally {
      setIsPending(false);
    }
  }

  function reorderEpisodes(sourceId: string, targetId: string) {
    if (sourceId === targetId) {
      return;
    }

    const updatedEpisodes = [...state.episodes];
    const sourceIndex = updatedEpisodes.findIndex((e) => e.id === sourceId);
    const targetIndex = updatedEpisodes.findIndex((e) => e.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const [moved] = updatedEpisodes.splice(sourceIndex, 1);
    updatedEpisodes.splice(targetIndex, 0, moved);

    // Update episodeNo based on new order
    const reordered = updatedEpisodes.map((ep, idx) => ({
      ...ep,
      episodeNo: idx + 1,
    }));

    setState((prev) => ({
      ...prev,
      episodes: reordered,
    }));
  }

  function handleDragStart(id: string, event: React.DragEvent<HTMLDivElement>) {
    setDraggingId(id);
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
    const sourceId = event.dataTransfer.getData("text/plain");
    if (!sourceId) {
      return;
    }
    reorderEpisodes(sourceId, targetId);
    setDraggingId(null);
  }

  function handleDragEnd() {
    setDraggingId(null);
  }

  return (
    <div className="min-h-screen bg-surface-0 text-primary animate-in fade-in duration-700">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,183,77,0.18),_transparent_70%)]" />
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-8 relative">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-accent-0 font-semibold">
                  Playlist Anime
                </p>
                <h1 className="text-3xl md:text-4xl font-black text-primary">
                  {playlistName}
                </h1>
                <p className="text-secondary mt-2 max-w-2xl">
                  Quản lý danh sách tập phim, sắp xếp thứ tự, và cập nhật trạng
                  thái theo thời điểm phát hành.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-surface-1/60 border border-border/30 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-secondary">
                  Tổng tập
                </p>
                <p className="text-2xl font-bold text-primary">{stats.total}</p>
              </div>
              <div className="rounded-2xl bg-surface-1/60 border border-border/30 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-secondary">
                  Sắp chiếu
                </p>
                <p className="text-2xl font-bold text-primary">
                  {stats.upcoming}
                </p>
              </div>
              <div className="rounded-2xl bg-surface-1/60 border border-border/30 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-secondary">
                  Đang chiếu
                </p>
                <p className="text-2xl font-bold text-primary">
                  {stats.airing}
                </p>
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
              Kéo thả để sắp xếp
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {state.episodes.map((episode) => {
              const statusLabel = getStatusLabel(episode.publishedAt);
              const isEditing = editingId === episode.id;
              const isDragging = draggingId === episode.id;

              return (
                <div
                  key={episode.id}
                  draggable
                  onDragStart={(event) => handleDragStart(episode.id, event)}
                  onDragOver={handleDragOver}
                  onDrop={(event) => handleDrop(episode.id, event)}
                  onDragEnd={handleDragEnd}
                  className={`rounded-2xl border p-4 transition cursor-grab ${
                    isDragging
                      ? "border-accent-0 bg-[rgba(255,183,77,0.12)]"
                      : "border-border/30 bg-surface-0/60"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-lg bg-surface-1 text-primary">
                        {episode.episodeNo}
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
                          {episode.subTitle} • {episode.duration}s •{" "}
                          <span>
                            {isMounted && episode.publishedAt
                              ? typeof episode.publishedAt === "string"
                                ? new Date(episode.publishedAt).toLocaleString()
                                : episode.publishedAt.toLocaleString()
                              : ""}
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

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className="px-3 py-2 text-xs rounded-xl bg-white/5 border border-border/30 hover:-translate-y-0.5 transition"
                        onClick={() => startEdit(episode)}
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        className="px-3 py-2 text-xs rounded-xl bg-red-500/10 text-red-200 border border-red-500/30 hover:-translate-y-0.5 transition"
                        onClick={() => handleDelete(episode.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>

                  {isEditing && editDraft && (
                    <div className="mt-4 rounded-2xl bg-surface-1/60 border border-border/30 p-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="h-12">
                          <FloatInput
                            name="editTitle"
                            label="Tiêu đề tập"
                            value={editDraft.title}
                            disabled={false}
                            required
                            onChange={(event) =>
                              setEditDraft({
                                ...editDraft,
                                title: event.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="h-12">
                          <FloatInput
                            name="editSubTitle"
                            label="Tiêu đề phụ"
                            value={editDraft.subTitle}
                            disabled={false}
                            onChange={(event) =>
                              setEditDraft({
                                ...editDraft,
                                subTitle: event.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="h-12">
                          <DurationInput
                            name="editDuration"
                            label="Thời lượng"
                            duration={editDraft.duration}
                            disabled={false}
                            onChange={(_, d) =>
                              setEditDraft({
                                ...editDraft,
                                duration: d,
                              })
                            }
                          />
                        </div>
                        <div className="h-12">
                          <FloatDateInput
                            name="editPublishedAt"
                            label="Ngày chiếu"
                            value={editDraft.publishedAtStr}
                            disabled={false}
                            onChange={(event) =>
                              setEditDraft({
                                ...editDraft,
                                publishedAtStr: event.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="h-12 md:col-span-2">
                          <FloatInput
                            name="editVideoUrl"
                            label="Link phim"
                            value={editDraft.videoUrl ?? ""}
                            disabled={false}
                            required
                            onChange={(event) =>
                              setEditDraft({
                                ...editDraft,
                                videoUrl: event.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="h-24">
                          <FloatTextarea
                            name="editDescription"
                            label="Mô tả"
                            value={editDraft.description ?? ""}
                            disable={false}
                            onChange={(event) =>
                              setEditDraft({
                                ...editDraft,
                                description: event.target.value,
                              })
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
            <h2 className="text-2xl font-bold text-primary mb-4">
              Thêm tập mới
            </h2>
            <div className="grid gap-4">
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

              {errorMessage && (
                <p className="text-sm text-alert-0">{errorMessage}</p>
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
