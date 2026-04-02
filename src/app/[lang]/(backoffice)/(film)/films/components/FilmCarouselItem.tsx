"use client";
import { Film } from "@/app/feature/film";
import Link from "next/link";

export const NewestFilmCarouselItem = ({ item }: { item: Film }) => {
  return (
    <Link
      href={`/films/${item.slug}-${item.id}`}
      className="group relative flex flex-col rounded-xl overflow-hidden w-[280px] h-[160px] mx-auto shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-white/10 hover:border-accent-0"
    >
      <img
        src={item.bannerUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500" />

      {/* Content */}
      <div className="relative h-full w-full flex flex-col justify-end p-4 z-10">
        <div className="flex items-center gap-2 mb-1 transform transition-transform duration-500 group-hover:-translate-y-1">
          <span className="px-2 py-0.5 bg-accent-0 text-white text-[10px] font-bold rounded uppercase tracking-wider">
            Premium
          </span>
          <span className="text-white/70 text-[10px] font-medium uppercase tracking-widest">
            2026
          </span>
        </div>
        <h3 className="text-white font-bold text-lg leading-tight line-clamp-1 drop-shadow-lg transform transition-transform duration-500 group-hover:-translate-y-1">
          {item.title}
        </h3>

        {/* Progress Bar (Decorative) */}
        <div className="w-full h-1 bg-white/20 rounded-full mt-3 overflow-hidden">
          <div className="w-1/3 h-full bg-accent-0 transition-all duration-1000 group-hover:w-1/2" />
        </div>
      </div>

      {/* Play Icon on Hover */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100 bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30">
        <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </Link>
  );
};

