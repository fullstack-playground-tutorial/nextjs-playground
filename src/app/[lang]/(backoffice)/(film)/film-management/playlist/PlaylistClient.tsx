"use client";

import { useMemo, useRef, useState } from "react";
import FloatInput from "@/app/[lang]/(backoffice)/components/FloatInput";
import FloatTextarea from "@/app/[lang]/(backoffice)/components/FloatTextarea";
import Uploader from "@/app/components/Upload";

const STATUS_LABELS = {
  upcoming: "Sap chieu",
  airing: "Dang chieu",
  unknown: "Chua xac dinh",
} as const;

type Episode = {
  id: string;
  number: number;
  title: string;
  subTitle: string;
  duration: string;
  publishedAt: string;
  videoUrl?: string;
  videoFileName?: string;
  translateFileName?: string;
  note?: string;
};

type NewEpisode = Omit<Episode, "id" | "number">;

type EditDraft = Episode;

const seedEpisodes: Episode[] = [
  {
    id: "ep-01",
    number: 1,
    title: "Doi gio tren pho den",
    subTitle: "Phan mo dau",
    duration: "24:10",
    publishedAt: "2025-12-20 20:00",
    videoUrl: "https://example.com/anime/ep1",
  },
  {
    id: "ep-02",
    number: 2,
    title: "Chuyen tam giua pho dong",
    subTitle: "Gap go",
    duration: "23:48",
    publishedAt: "2026-01-05 20:00",
    videoUrl: "https://example.com/anime/ep2",
  },
  {
    id: "ep-03",
    number: 3,
    title: "Ngay mua mat",
    subTitle: "Tinh ban moi",
    duration: "24:03",
    publishedAt: "2026-04-01 20:00",
    videoUrl: "https://example.com/anime/ep3",
    translateFileName: "ep3-vi.vtt",
  },
];

const emptyNewEpisode: NewEpisode = {
  title: "",
  subTitle: "",
  duration: "24:00",
  publishedAt: "",
  videoUrl: "",
  note: "",
};

function normalizeOrder(list: Episode[]): Episode[] {
  return list.map((episode, index) => ({
    ...episode,
    number: index + 1,
  }));
}

function parseDate(value: string): Date | null {
  const parsed = new Date(value.replace(" ", "T"));
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
}

function getStatusLabel(publishedAt: string) {
  const parsed = parseDate(publishedAt);
  if (!parsed) {
    return STATUS_LABELS.unknown;
  }
  return parsed.getTime() > Date.now()
    ? STATUS_LABELS.upcoming
    : STATUS_LABELS.airing;
}

function getCurrentEpisode(episodes: Episode[]) {
  const now = Date.now();
  const withDate = episodes
    .map((episode) => ({
      episode,
      time: parseDate(episode.publishedAt)?.getTime(),
    }))
    .filter((item) => item.time !== undefined) as { episode: Episode; time: number }[];

  if (withDate.length === 0) {
    return null;
  }

  const past = withDate.filter((item) => item.time <= now);
  if (past.length > 0) {
    return past.sort((a, b) => b.time - a.time)[0].episode;
  }

  return withDate.sort((a, b) => a.time - b.time)[0].episode;
}

export default function PlaylistClient({ playlistName }: { playlistName: string }) {
  const [episodes, setEpisodes] = useState<Episode[]>(seedEpisodes);
  const [newEpisode, setNewEpisode] = useState<NewEpisode>(emptyNewEpisode);
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
  const [newTranslateFile, setNewTranslateFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);
  const [editVideoFile, setEditVideoFile] = useState<File | null>(null);
  const [editTranslateFile, setEditTranslateFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const newVideoInputRef = useRef<HTMLInputElement>(null);
  const newTranslateInputRef = useRef<HTMLInputElement>(null);
  const editVideoInputRef = useRef<HTMLInputElement>(null);
  const editTranslateInputRef = useRef<HTMLInputElement>(null);

  const stats = useMemo(() => {
    const total = episodes.length;
    const upcoming = episodes.filter(
      (episode) => getStatusLabel(episode.publishedAt) === STATUS_LABELS.upcoming
    ).length;
    const airing = episodes.filter(
      (episode) => getStatusLabel(episode.publishedAt) === STATUS_LABELS.airing
    ).length;
    return { total, upcoming, airing };
  }, [episodes]);

  const currentEpisode = useMemo(() => getCurrentEpisode(episodes), [episodes]);

  function handleAddEpisode() {
    setErrorMessage("");

    if (!newEpisode.title.trim()) {
      setErrorMessage("Can nhap tieu de tap.");
      return;
    }

    if (!newEpisode.publishedAt.trim()) {
      setErrorMessage("Can nhap publishedAt.");
      return;
    }

    if (!newEpisode.videoUrl?.trim() && !newVideoFile) {
      setErrorMessage("Can nhap link phim hoac upload video.");
      return;
    }

    setEpisodes((prev) =>
      normalizeOrder([
        ...prev,
        {
          id: `ep-${Date.now()}`,
          number: prev.length + 1,
          title: newEpisode.title.trim(),
          subTitle: newEpisode.subTitle.trim(),
          duration: newEpisode.duration.trim() || "24:00",
          publishedAt: newEpisode.publishedAt.trim(),
          videoUrl: newEpisode.videoUrl?.trim(),
          videoFileName: newVideoFile?.name,
          translateFileName: newTranslateFile?.name,
          note: newEpisode.note?.trim() || "",
        },
      ])
    );

    setNewEpisode(emptyNewEpisode);
    setNewVideoFile(null);
    setNewTranslateFile(null);
  }

  function handleDelete(id: string) {
    setEpisodes((prev) => normalizeOrder(prev.filter((episode) => episode.id !== id)));
  }

  function startEdit(episode: Episode) {
    setEditingId(episode.id);
    setEditDraft({ ...episode });
    setEditVideoFile(null);
    setEditTranslateFile(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft(null);
    setEditVideoFile(null);
    setEditTranslateFile(null);
  }

  function saveEdit() {
    if (!editDraft) {
      return;
    }
    if (!editDraft.title.trim()) {
      return;
    }
    if (!editDraft.publishedAt.trim()) {
      return;
    }
    if (!editDraft.videoUrl?.trim() && !editDraft.videoFileName && !editVideoFile) {
      return;
    }

    setEpisodes((prev) =>
      normalizeOrder(
        prev.map((episode) =>
          episode.id === editDraft.id
            ? {
                ...episode,
                title: editDraft.title.trim(),
                subTitle: editDraft.subTitle.trim(),
                duration: editDraft.duration.trim() || "24:00",
                publishedAt: editDraft.publishedAt.trim(),
                videoUrl: editDraft.videoUrl?.trim(),
                videoFileName: editVideoFile?.name ?? editDraft.videoFileName,
                translateFileName: editTranslateFile?.name ?? editDraft.translateFileName,
                note: editDraft.note?.trim() || "",
              }
            : episode
        )
      )
    );

    cancelEdit();
  }

  function reorderEpisodes(sourceId: string, targetId: string) {
    if (sourceId === targetId) {
      return;
    }

    setEpisodes((prev) => {
      const sourceIndex = prev.findIndex((episode) => episode.id === sourceId);
      const targetIndex = prev.findIndex((episode) => episode.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) {
        return prev;
      }
      const next = [...prev];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return normalizeOrder(next);
    });
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

  function handleDrop(targetId: string, event: React.DragEvent<HTMLDivElement>) {
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
                  Quan ly danh sach tap phim, sap xep thu tu, va cap nhat trang
                  thai theo publishedAt.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="px-5 py-3 rounded-2xl bg-surface-1 border border-border/40 text-sm font-semibold hover:-translate-y-0.5 transition"
                  onClick={() => setEpisodes((prev) => normalizeOrder([...prev]))}
                >
                  Tu dong danh so
                </button>
                <button
                  type="button"
                  className="px-5 py-3 rounded-2xl bg-accent-0 text-white text-sm font-semibold shadow-[0_12px_30px_rgba(255,183,77,0.25)] hover:-translate-y-0.5 transition"
                >
                  Luu thay doi
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-surface-1/60 border border-border/30 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-secondary">Tong tap</p>
                <p className="text-2xl font-bold text-primary">{stats.total}</p>
              </div>
              <div className="rounded-2xl bg-surface-1/60 border border-border/30 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-secondary">Sap chieu</p>
                <p className="text-2xl font-bold text-primary">{stats.upcoming}</p>
              </div>
              <div className="rounded-2xl bg-surface-1/60 border border-border/30 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-secondary">Dang chieu</p>
                <p className="text-2xl font-bold text-primary">{stats.airing}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-16 grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
        <section className="rounded-[28px] border border-border/40 bg-surface-1/40 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-primary">Danh sach tap</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-secondary">
              Keo tha de sap xep
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {episodes.map((episode) => {
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
                        {episode.number}
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
                          {episode.subTitle} • {episode.duration} • {episode.publishedAt}
                        </p>
                        {episode.videoUrl && (
                          <p className="text-xs text-secondary mt-1">
                            Link: {episode.videoUrl}
                          </p>
                        )}
                        {episode.videoFileName && (
                          <p className="text-xs text-secondary mt-1">
                            Video: {episode.videoFileName}
                          </p>
                        )}
                        {episode.translateFileName && (
                          <p className="text-xs text-secondary mt-1">
                            Translate: {episode.translateFileName}
                          </p>
                        )}
                        {episode.note && (
                          <p className="text-xs text-secondary mt-2">{episode.note}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className="px-3 py-2 text-xs rounded-xl bg-white/5 border border-border/30 hover:-translate-y-0.5 transition"
                        onClick={() => startEdit(episode)}
                      >
                        Sua
                      </button>
                      <button
                        type="button"
                        className="px-3 py-2 text-xs rounded-xl bg-red-500/10 text-red-200 border border-red-500/30 hover:-translate-y-0.5 transition"
                        onClick={() => handleDelete(episode.id)}
                      >
                        Xoa
                      </button>
                    </div>
                  </div>

                  {isEditing && editDraft && (
                    <div className="mt-4 rounded-2xl bg-surface-1/60 border border-border/30 p-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="h-12">
                          <FloatInput
                            name="editTitle"
                            label="Tieu de tap"
                            value={editDraft.title}
                            disable={false}
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
                            label="Tieu de phu"
                            value={editDraft.subTitle}
                            disable={false}
                            onChange={(event) =>
                              setEditDraft({
                                ...editDraft,
                                subTitle: event.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="h-12">
                          <FloatInput
                            name="editDuration"
                            label="Thoi luong"
                            value={editDraft.duration}
                            disable={false}
                            onChange={(event) =>
                              setEditDraft({
                                ...editDraft,
                                duration: event.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="h-12">
                          <FloatInput
                            name="editPublishedAt"
                            label="PublishedAt (YYYY-MM-DD HH:mm)"
                            value={editDraft.publishedAt}
                            disable={false}
                            required
                            onChange={(event) =>
                              setEditDraft({
                                ...editDraft,
                                publishedAt: event.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="h-12 md:col-span-2">
                          <FloatInput
                            name="editVideoUrl"
                            label="Link phim (1 trong 2)"
                            value={editDraft.videoUrl ?? ""}
                            disable={false}
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

                      <div className="grid gap-4 md:grid-cols-2 mt-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-sm text-secondary">
                            Upload video (1 trong 2)<span className="text-alert-0">*</span>
                          </label>
                          <div
                            className="w-full rounded-2xl border-2 border-dashed border-border/50 bg-surface-0/70 p-4 cursor-pointer hover:border-accent-0/60 transition"
                            onClick={() => editVideoInputRef.current?.click()}
                          >
                            <Uploader
                              handleDrop={(files) => setEditVideoFile(files[0] ?? null)}
                            >
                              <div className="flex flex-col items-center justify-center text-center gap-2 py-2">
                                <div className="text-xs uppercase tracking-[0.2em] text-secondary">
                                  Video
                                </div>
                                <div className="text-sm text-secondary">
                                  {editVideoFile?.name ??
                                    editDraft.videoFileName ??
                                    "Keo tha video vao day hoac click"}
                                </div>
                              </div>
                            </Uploader>
                          </div>
                          <input
                            type="file"
                            ref={editVideoInputRef}
                            className="hidden"
                            accept="video/*"
                            onChange={(event) =>
                              setEditVideoFile(event.target.files?.[0] ?? null)
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-sm text-secondary">Translate track (optional)</label>
                          <div
                            className="w-full rounded-2xl border-2 border-dashed border-border/50 bg-surface-0/70 p-4 cursor-pointer hover:border-accent-0/60 transition"
                            onClick={() => editTranslateInputRef.current?.click()}
                          >
                            <Uploader
                              handleDrop={(files) => setEditTranslateFile(files[0] ?? null)}
                            >
                              <div className="flex flex-col items-center justify-center text-center gap-2 py-2">
                                <div className="text-xs uppercase tracking-[0.2em] text-secondary">
                                  Subtitle
                                </div>
                                <div className="text-sm text-secondary">
                                  {editTranslateFile?.name ??
                                    editDraft.translateFileName ??
                                    "Keo tha file subtitle .vtt/.srt"}
                                </div>
                              </div>
                            </Uploader>
                          </div>
                          <input
                            type="file"
                            ref={editTranslateInputRef}
                            className="hidden"
                            accept=".vtt,.srt"
                            onChange={(event) =>
                              setEditTranslateFile(event.target.files?.[0] ?? null)
                            }
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="h-24">
                          <FloatTextarea
                            name="editNote"
                            label="Ghi chu"
                            value={editDraft.note ?? ""}
                            disable={false}
                            onChange={(event) =>
                              setEditDraft({
                                ...editDraft,
                                note: event.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 mt-4">
                        <button
                          type="button"
                          className="px-4 py-2 rounded-xl bg-accent-0 text-white text-sm font-semibold"
                          onClick={saveEdit}
                        >
                          Luu
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 rounded-xl bg-surface-1 text-sm font-semibold"
                          onClick={cancelEdit}
                        >
                          Huy
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
            <h2 className="text-2xl font-bold text-primary mb-4">Them tap moi</h2>
            <div className="grid gap-4">
              <div className="h-12">
                <FloatInput
                  name="newTitle"
                  label="Tieu de tap"
                  value={newEpisode.title}
                  disable={false}
                  required
                  onChange={(event) =>
                    setNewEpisode({
                      ...newEpisode,
                      title: event.target.value,
                    })
                  }
                />
              </div>
              <div className="h-12">
                <FloatInput
                  name="newSubTitle"
                  label="Tieu de phu"
                  value={newEpisode.subTitle}
                  disable={false}
                  onChange={(event) =>
                    setNewEpisode({
                      ...newEpisode,
                      subTitle: event.target.value,
                    })
                  }
                />
              </div>
              <div className="h-12">
                <FloatInput
                  name="newDuration"
                  label="Thoi luong"
                  value={newEpisode.duration}
                  disable={false}
                  onChange={(event) =>
                    setNewEpisode({
                      ...newEpisode,
                      duration: event.target.value,
                    })
                  }
                />
              </div>
              <div className="h-12">
                <FloatInput
                  name="newPublishedAt"
                  label="PublishedAt (YYYY-MM-DD HH:mm)"
                  value={newEpisode.publishedAt}
                  disable={false}
                  required
                  onChange={(event) =>
                    setNewEpisode({
                      ...newEpisode,
                      publishedAt: event.target.value,
                    })
                  }
                />
              </div>
              <div className="h-12">
                <FloatInput
                  name="newVideoUrl"
                  label="Link phim (1 trong 2)"
                  value={newEpisode.videoUrl ?? ""}
                  disable={false}
                  required
                  onChange={(event) =>
                    setNewEpisode({
                      ...newEpisode,
                      videoUrl: event.target.value,
                    })
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-secondary">
                    Upload video (1 trong 2)<span className="text-alert-0">*</span>
                  </label>
                  <div
                    className="w-full rounded-2xl border-2 border-dashed border-border/50 bg-surface-0/70 p-4 cursor-pointer hover:border-accent-0/60 transition"
                    onClick={() => newVideoInputRef.current?.click()}
                  >
                    <Uploader
                      handleDrop={(files) => setNewVideoFile(files[0] ?? null)}
                    >
                      <div className="flex flex-col items-center justify-center text-center gap-2 py-2">
                        <div className="text-xs uppercase tracking-[0.2em] text-secondary">
                          Video
                        </div>
                        <div className="text-sm text-secondary">
                          {newVideoFile?.name ?? "Keo tha video vao day hoac click"}
                        </div>
                      </div>
                    </Uploader>
                  </div>
                  <input
                    type="file"
                    ref={newVideoInputRef}
                    className="hidden"
                    accept="video/*"
                    onChange={(event) => setNewVideoFile(event.target.files?.[0] ?? null)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-secondary">Translate track (optional)</label>
                  <div
                    className="w-full rounded-2xl border-2 border-dashed border-border/50 bg-surface-0/70 p-4 cursor-pointer hover:border-accent-0/60 transition"
                    onClick={() => newTranslateInputRef.current?.click()}
                  >
                    <Uploader
                      handleDrop={(files) => setNewTranslateFile(files[0] ?? null)}
                    >
                      <div className="flex flex-col items-center justify-center text-center gap-2 py-2">
                        <div className="text-xs uppercase tracking-[0.2em] text-secondary">
                          Subtitle
                        </div>
                        <div className="text-sm text-secondary">
                          {newTranslateFile?.name ?? "Keo tha file subtitle .vtt/.srt"}
                        </div>
                      </div>
                    </Uploader>
                  </div>
                  <input
                    type="file"
                    ref={newTranslateInputRef}
                    className="hidden"
                    accept=".vtt,.srt"
                    onChange={(event) =>
                      setNewTranslateFile(event.target.files?.[0] ?? null)
                    }
                  />
                </div>
              </div>

              <div className="h-24">
                <FloatTextarea
                  name="newNote"
                  label="Ghi chu"
                  value={newEpisode.note ?? ""}
                  disable={false}
                  onChange={(event) =>
                    setNewEpisode({
                      ...newEpisode,
                      note: event.target.value,
                    })
                  }
                />
              </div>

              {errorMessage && (
                <p className="text-sm text-alert-0">{errorMessage}</p>
              )}

              <button
                type="button"
                className="mt-2 px-5 py-3 rounded-2xl bg-accent-0 text-white text-sm font-semibold hover:-translate-y-0.5 transition"
                onClick={handleAddEpisode}
              >
                Them tap
              </button>
              <p className="text-xs text-secondary">
                Bat buoc co link phim hoac upload video. Status tu dong tinh theo publishedAt.
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-border/40 bg-surface-1/40 p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-primary">Tap dang chieu</h3>
            {currentEpisode ? (
              <div className="mt-4 rounded-2xl bg-surface-0/70 border border-border/30 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-secondary">Tap {currentEpisode.number}</p>
                    <p className="text-lg font-semibold text-primary">{currentEpisode.title}</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-accent-0">
                    {getStatusLabel(currentEpisode.publishedAt)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-secondary mt-4">Chua co tap.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
