"use client";

import Pagination from "@/components/Pagination";
import { useMemo } from "react";
import { Film } from "@/app/feature/film";
import { config } from "@/app/config";
import Link from "next/link";
import Image from "next/image";
import { SearchResult } from "@/app/utils/service";

type Props = {
    searchParams: {
        q?: string;
        page?: string;
        sort?: string;
        limit?: string;
        interests?: string;
        fromYear?: string;
        toYear?: string;
    };
    limit: number;
    currentPage: number;
    sort?: string;

    searchResult: SearchResult<Film>;
};

const FilmCard = ({ film }: { film: Film }) => {
    const getImageUrl = (url: string) => {
        if (!url) return "";
        if (url.startsWith("blob:") || url.startsWith("data:") || url.startsWith("http")) return url;
        return `${config.image_url_host}/${url}.image/webp.webp`;
    };

    return (
        <Link
            href={`/films/${film.slug}-${film.id}`}
            className="group relative flex flex-col gap-3 transition-all duration-500 hover:-translate-y-2"
        >
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-white/5 bg-surface-1 shadow-2xl transition-all duration-500 group-hover:border-accent-0/50 group-hover:shadow-accent-0/20">
                <Image
                    src={getImageUrl(film.posterUrl || "")}
                    alt={film.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 flex flex-col justify-end p-5">
                    <div className="translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                        <div className="flex flex-wrap gap-2 mb-3">
                            {film.interests?.slice(0, 2).map((interest) => (
                                <span key={interest.id} className="rounded-full bg-accent-0/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-0 backdrop-blur-md border border-accent-0/30">
                                    {interest.title}
                                </span>
                            ))}
                        </div>
                        <p className="text-sm font-bold text-white line-clamp-2 leading-tight">
                            {film.subTitle || "Xem ngay bản đẹp HD"}
                        </p>
                    </div>
                </div>

                {/* Episode Badge */}
                {film.newestEpisode ? (
                    <div className="absolute top-3 right-3 rounded-lg bg-black/60 px-2 py-1 text-[10px] font-black uppercase tracking-tighter text-white backdrop-blur-xl border border-white/10">
                        Tập {film.newestEpisode}
                        {film.numberOfEpisodes && ` / ${film.numberOfEpisodes}`}
                    </div>
                ) : (
                    <div className="absolute top-3 right-3 rounded-lg bg-accent-0 px-2 py-1 text-[10px] font-black uppercase tracking-tighter text-white shadow-xl">
                        MOVIE
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-1 px-1">
                <h3 className="line-clamp-1 text-base font-bold text-primary transition-colors group-hover:text-accent-0">
                    {film.title}
                </h3>
                <div className="flex items-center gap-2 text-[12px] font-medium text-secondary">
                    <span>{film.publishedAt ? new Date(film.publishedAt).getFullYear() : '2026'}</span>
                    <span className="h-1 w-1 rounded-full bg-secondary/30"></span>
                    <span>HD • Vietsub</span>
                </div>
            </div>
        </Link>
    );
};



export default function FilmList(props: Props) {
    const { searchParams, searchResult } = props;
    const { list: films, total } = searchResult;

    const pageTotal = useMemo(() => {
        return Math.ceil(total / props.limit);
    }, [total, props.limit]);
    const handlePageChange = (page: number) => {

    };
    if (films.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 px-10 text-center bg-surface-1/30 rounded-[2rem] border border-dashed border-white/10 backdrop-blur-sm">
                <div className="w-24 h-24 mb-8 flex items-center justify-center rounded-full bg-surface-2/50 text-secondary border border-white/5 shadow-inner">
                    <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-black text-primary mb-3 tracking-tight uppercase">Không tìm thấy kết quả</h3>
                <p className="text-secondary mb-10 max-w-sm font-medium leading-relaxed">Rất tiếc, chúng tôi không tìm thấy phim nào khớp với lựa chọn của bạn. Hãy thử thay đổi bộ lọc hoặc từ khóa.</p>
                <button
                    onClick={() => window.location.href = window.location.pathname}
                    className="group relative px-10 py-3.5 bg-accent-0 overflow-hidden font-bold rounded-2xl transition-all shadow-[0_10px_30px_rgba(255,145,0,0.3)] active:scale-95 text-white"
                >
                    <span className="relative z-10 uppercase">Xóa tất cả bộ lọc</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
            </div>
        );
    }

    return (
        <div className="w-full space-y-14 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-primary flex items-center gap-4">
                        PHIM ĐANG HIỂN THỊ
                        <span className="text-xs font-black text-accent-0 bg-accent-0/10 px-4 py-1.5 rounded-full border border-accent-0/20 shadow-[0_0_15px_rgba(255,183,77,0.1)]">
                            {total} KẾT QUẢ
                        </span>
                    </h2>
                    <p className="text-xs text-secondary font-bold uppercase tracking-widest opacity-60">Dựa trên tiêu chí tìm kiếm của bạn</p>
                </div>
            </div>

            <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-12 transition-opacity duration-500 opacity-100`}>
                {films.map((film) => (
                    <FilmCard key={film.id} film={film} />
                ))}
            </div>

            {props.limit > 0 && (
                <div className="flex justify-center pt-16 pb-10">
                    <div className="bg-surface-1/50 backdrop-blur-xl p-2 rounded-2xl border border-white/5 shadow-2xl">
                        <Pagination
                            total={pageTotal}
                            currentPage={props.currentPage}
                            onPageChanged={handlePageChange}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}