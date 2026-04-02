
"use server";

import { getFilmService } from "@/app/core/server/context";
import { config } from "@/app/config";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Icons
import BackArrowIcon from "@/app/assets/images/icons/back_arrow.svg";
import FilmIconRaw from "../../../components/Sidebar/icons/film.svg";
const FilmIcon = FilmIconRaw as React.FC<React.SVGProps<SVGSVGElement>>;
import PlayCircleIcon from "@/app/assets/images/icons/play_circle.svg";

import { Breadcrumb } from "../components/Breadcrumb";
import WrapperItem from "../components/WrapperItem";

export default async function Page(props: {
    params: Promise<{ slugWithId: string; lang: string }>;
}) {
    const { slugWithId, lang } = await props.params;
    const id = slugWithId.slice(-36);

    const film = await getFilmService().load(id);

    if (!film) {
        notFound();
    }

    // Mocking episodes for demonstration
    const episodes = [
        {
            id: "ep-01",
            title: "Khởi đầu mới",
            subTitle: "Hành trình bắt đầu",
            thumbnailUrl: film.posterUrl,
            publishedAt: new Date().toISOString(),
        },
        {
            id: "ep-02",
            title: "Cuộc gặp gỡ định mệnh",
            subTitle: "Bí mật được hé lộ",
            thumbnailUrl: film.posterUrl,
            publishedAt: new Date().toISOString(),
        },
        {
            id: "ep-03",
            title: "Thử thách đầu tiên",
            subTitle: "Sức mạnh bộc phát",
            thumbnailUrl: film.posterUrl,
            publishedAt: new Date().toISOString(),
        },
        {
            id: "ep-04",
            title: "Người bạn mới",
            subTitle: "Sự tin tưởng tuyệt đối",
            thumbnailUrl: film.posterUrl,
            publishedAt: new Date().toISOString(),
        },
        {
            id: "ep-05",
            title: "Bóng tối bao trùm",
            subTitle: "Kẻ thù xuất hiện",
            thumbnailUrl: film.posterUrl,
            publishedAt: new Date().toISOString(),
        },
    ];

    const blurPlaceholder =
        "data:image/png;base64,L042PFog4mV@%Mj[M{fk8^WB.9t7";

    return (
        <div className="w-full">
            <div className="p-1 font-semibold text-shadow-2xs mb-4 dark:text-accent-0">
                <Breadcrumb
                    ItemAppearance={WrapperItem}
                    items={[
                        {
                            label: "Home",
                            href: "/",
                        },
                        {
                            label: "Films",
                            href: "/films",
                        },
                        {
                            label: film.title,
                            href: `/films/${slugWithId}`,
                        },
                    ]}
                    className="px-2 py-1"
                />
            </div>

            <div className="pb-12">
                {/* Hero Section with Banner */}
                <div className="relative h-[450px] w-full overflow-hidden">
                    {film.bannerUrl ? (
                        <Image
                            src={`${config.image_url_host}/${film.bannerUrl}.image/webp.webp`}
                            alt={film.title}
                            fill
                            className="object-cover transition-transform duration-1000 hover:scale-105"
                            priority
                            placeholder="blur"
                            blurDataURL={blurPlaceholder}
                        />
                    ) : (
                        <div className="h-full w-full bg-gradient-to-r from-surface-1 to-surface-3 flex items-center justify-center">
                            <FilmIcon className="size-32 fill-secondary opacity-20" />
                        </div>
                    )}
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-0 via-surface-0/40 to-transparent" />

                    {/* Back Button */}
                    <div className="absolute top-8 left-8 z-20">
                        <Link
                            href={`/films`}
                            className="flex items-center gap-2 px-5 py-2.5 bg-surface-0/40 backdrop-blur-xl border border-white/10 rounded-full hover:bg-surface-0/60 transition-all text-white font-medium group shadow-2xl"
                        >
                            <BackArrowIcon className="size-4 fill-current group-hover:-translate-x-1 transition-transform" />
                            <span>Trang chủ</span>
                        </Link>
                    </div>
                </div>

                {/* Content Container */}
                <div className="max-w-7xl mx-auto px-6 -mt-40 relative z-10 flex flex-col lg:flex-row gap-10">
                    {/* Poster Card */}
                    <div className="w-full lg:w-80 shrink-0">
                        <div className="relative aspect-[2/3] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-surface-1 bg-surface-2 group">
                            {film.posterUrl ? (
                                <Image
                                    src={`${config.image_url_host}/${film.posterUrl}.image/webp.webp`}
                                    alt={film.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    placeholder="blur"
                                    blurDataURL={blurPlaceholder}
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                    <FilmIcon className="size-20 fill-secondary opacity-50" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="bg-accent-0 text-white p-4 rounded-full scale-90 group-hover:scale-100 transition-transform shadow-2xl">
                                    <PlayCircleIcon className="size-10 fill-current" />
                                </div>
                            </div>
                        </div>

                        {/* Metadata Sidebar */}
                        <div className="mt-8 space-y-6 bg-surface-1/40 backdrop-blur-md p-6 rounded-3xl border dark:border-border/50 shadow-xl">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-accent-0 font-bold">
                                    Đạo diễn
                                </span>
                                <p className="text-primary font-medium text-lg">
                                    {film.director || "Chưa cập nhật"}
                                </p>
                            </div>
                            <div className="divider h-px bg-border/30 w-full" />
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-accent-0 font-bold">
                                    Ngày phát hành
                                </span>
                                <p className="text-primary font-medium">
                                    {film.publishedAt
                                        ? new Date(film.publishedAt).toLocaleDateString("vi-VN", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })
                                        : "Chưa xác định"}
                                </p>
                            </div>
                            <div className="divider h-px bg-border/30 w-full" />
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-accent-0 font-bold">
                                    Trạng thái tập
                                </span>
                                <p className="text-primary font-medium">
                                    {film.numberOfEpisodes ? `${film.numberOfEpisodes} Tập` : "Phim lẻ"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Details */}
                    <div className="flex-1 lg:pt-14">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                            <div className="max-w-3xl">
                                <h1 className="text-4xl md:text-6xl font-black dark:text-primary tracking-tight mb-3 drop-shadow-2xl">
                                    {film.title}
                                </h1>
                                {film.subTitle && (
                                    <p className="text-2xl text-accent-0 font-semibold opacity-90 italic">
                                        {film.subTitle}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Genres/Interests */}
                        <div className="flex flex-wrap gap-2.5 mb-10">
                            {film.interests?.map((interest) => (
                                <span
                                    key={interest.id}
                                    className="px-5 py-2 bg-white/5 hover:bg-white/10 rounded-xl border dark:border-white/10 text-sm font-semibold transition-all cursor-pointer backdrop-blur-sm"
                                >
                                    {interest.title}
                                </span>
                            ))}
                        </div>

                        {/* Description */}
                        <div className="bg-surface-1/20 rounded-[2rem] p-10 border dark:border-white/5 backdrop-blur-md mb-10 shadow-inner">
                            <h3 className="text-2xl font-black mb-6 flex items-center gap-3 dark:text-primary">
                                <span className="w-2 h-8 bg-accent-0 rounded-full shadow-[0_0_15px_rgba(255,183,77,0.5)]"></span>
                                Cốt truyện
                            </h3>
                            <p className="dark:text-secondary/90 leading-relaxed text-xl font-light whitespace-pre-line">
                                {film.description || "Bộ phim này hiện chưa có tóm tắt nội dung."}
                            </p>
                        </div>

                        {/* Episodes Section */}
                        {episodes && episodes.length > 0 && (
                            <div className="mb-10">
                                <h3 className="text-2xl font-black mb-8 flex items-center gap-3 dark:text-primary">
                                    <span className="w-2 h-8 bg-accent-0 rounded-full shadow-[0_0_15px_rgba(255,183,77,0.5)]"></span>
                                    Danh sách tập phim
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {episodes.map((ep, idx) => (
                                        <Link
                                            key={ep.id}
                                            href={`/films/${slugWithId}/watch?episode=${ep.id}`}
                                            className="group relative flex flex-col bg-surface-1/40 hover:bg-surface-1/60 rounded-2xl overflow-hidden border border-white/5 hover:border-accent-0/40 transition-all duration-300"
                                        >
                                            <div className="aspect-video relative overflow-hidden">
                                                <Image
                                                    src={ep.thumbnailUrl ? `${config.image_url_host}/${ep.thumbnailUrl}.image/webp.webp` : (film.posterUrl ? `${config.image_url_host}/${film.posterUrl}.image/webp.webp` : "/placeholder.png")}
                                                    alt={ep.title || `Tập ${idx + 1}`}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <PlayCircleIcon className="size-12 fill-white drop-shadow-2xl" />
                                                </div>
                                                <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-accent-0 text-white text-[10px] font-black rounded uppercase tracking-widest">
                                                    Tập {idx + 1}
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-bold text-primary line-clamp-1 mb-1 group-hover:text-accent-0 transition-colors">
                                                    {ep.title || `Tập ${idx + 1}`}
                                                </h4>
                                                <p className="text-secondary/60 text-xs line-clamp-1">
                                                    {ep.subTitle || "Theo dõi diễn biến tiếp theo..."}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Trailer Section */}
                        {film.trailerUrl && (
                            <div className="bg-gradient-to-br from-surface-1/40 to-transparent rounded-[2rem] p-10 border dark:border-white/5 backdrop-blur-md">
                                <h3 className="text-2xl font-black mb-8 flex items-center gap-3 dark:text-primary">
                                    <span className="w-2 h-8 bg-accent-0 rounded-full shadow-[0_0_15px_rgba(255,183,77,0.5)]"></span>
                                    Trailer chính thức
                                </h3>
                                <div className="aspect-video relative rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-white/5">
                                    <iframe
                                        src={(() => {
                                            const url = film.trailerUrl;
                                            if (!url) return "";
                                            try {
                                                const urlObj = new URL(url);
                                                const v = urlObj.searchParams.get("v");
                                                if (v) return `https://www.youtube.com/embed/${v}`;
                                                if (urlObj.hostname.includes("youtu.be")) return `https://www.youtube.com/embed${urlObj.pathname}`;
                                            } catch (e) {
                                                // Fallback
                                            }
                                            return url.replace("watch?v=", "embed/");
                                        })()}
                                        className="absolute inset-0 w-full h-full"
                                        allowFullScreen
                                        title={`${film.title} Trailer`}
                                    ></iframe>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
