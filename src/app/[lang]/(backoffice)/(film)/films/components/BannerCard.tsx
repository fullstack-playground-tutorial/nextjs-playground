import { Interest } from "@/app/feature/film";
import Link from "next/link";
import React from "react";

interface Props {
  filmId: string;
  slug: string;
  bannerUrl?: string;
  logoUrl?: string;
  title: string;
  description?: string;
  totalOfEpisodes: number;
  interests: Interest[];
  numberOfCurrentEpisode: number;
  watchTrailer: () => void;
  isDisplayed: (filmId: string) => boolean;
}

export default function BannerCard({
  logoUrl,
  title,
  description,
  totalOfEpisodes,
  interests,
  numberOfCurrentEpisode,
  filmId,
  slug,
  bannerUrl,
  watchTrailer,
  isDisplayed,
}: Props) {


  return (
    <div
      style={
        {
          "--img-url": `url(${bannerUrl})`,
        } as React.CSSProperties
      }
      className={`absolute h-full w-full left-0 top-0 overflow-hidden bg-center bg-cover bg-no-repeat z-0 rounded-lg bg-[image:var(--img-url)] transition-opacity duration-1000 ${isDisplayed(filmId) ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
    >
      <div className="absolute h-full w-full from-[#0a0a0a]/90 via-[#0a0a0a]/50 to-transparent bg-gradient-to-r left-0 top-0 pointer-events-none"></div>
      <div className="absolute h-full bottom-0 left-0 w-full from-[#0a0a0a] via-transparent to-transparent bg-gradient-to-t pointer-events-none"></div>

      <div className="absolute left-0 top-0 h-full w-full md:w-[65%] lg:w-[55%] flex flex-col justify-center pl-6 pr-14 md:pl-16 md:pr-10 pt-12 pb-24 z-10 transition-all">
        {/* film info */}
        <div className="flex flex-col gap-4 md:gap-6 text-shadow-md tracking-tight text-gray-200">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={title + " logo"}
              className="h-24 md:h-36 object-contain object-left drop-shadow-2xl max-w-[80%] md:max-w-sm mb-2"
            />
          ) : (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white capitalize drop-shadow-2xl mb-2">
              {title}
            </h1>
          )}

          <div className="flex items-center gap-3 text-xs md:text-sm lg:text-base font-semibold">
            {totalOfEpisodes > 0 && (
              <span className="text-green-400 drop-shadow-md font-bold">
                {numberOfCurrentEpisode}/{totalOfEpisodes} Episodes
              </span>
            )}

            {interests.length > 0 && (
              <div className="flex gap-2 items-center flex-wrap">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                {interests.slice(0, 3).map((item) => (
                  <span
                    key={item.id}
                    className="text-gray-300 drop-shadow-md whitespace-nowrap"
                  >
                    {item.title}
                  </span>
                ))}
              </div>
            )}
          </div>

          <p className="text-sm md:text-base font-medium text-gray-300/90 text-left line-clamp-3 md:line-clamp-4 drop-shadow-md max-w-lg leading-relaxed md:leading-relaxed">
            {description}
          </p>

          {/* button groups */}
          <div className="flex flex-row gap-3 md:gap-4 mt-2 md:mt-4">
            <Link
              href={`films/${slug}-${filmId}`}
              className="flex items-center justify-center min-w-[120px] md:min-w-[140px] gap-2 font-bold px-4 md:px-6 py-2.5 md:py-3 bg-white text-black rounded-lg hover:bg-white/80 transition-all duration-300 shadow-xl hover:scale-105"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
              Play
            </Link>
            <button
              className="flex items-center justify-center min-w-[120px] md:min-w-[140px] gap-2 font-bold px-4 md:px-6 py-2.5 md:py-3 bg-gray-500/40 text-white rounded-lg hover:bg-gray-500/60 transition-all duration-300 shadow-xl backdrop-blur-md hover:scale-105 border border-white/20 hover:border-white/40"
              onClick={watchTrailer}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 md:w-6 md:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              Trailer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
