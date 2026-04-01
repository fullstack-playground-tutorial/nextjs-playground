"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import "./banner-slider.css";
import BannerCard from "./BannerCard";
import { Film } from "@/app/feature/film";

interface Props {
  duration: number;
  films: Film[];
}

type BannerState = {
  filmCurrentIdx: number;
  trailerVisible: boolean;
};

export default function Banner({ films, duration = 5000 }: Props) {
  const initialState: BannerState = {
    filmCurrentIdx: 0,
    trailerVisible: false,
  };

  const SECOND = 1000;
  const timerRef = useRef<NodeJS.Timeout>(null);
  const [state, setState] = useState(initialState);
  const switchRef = useRef<HTMLDivElement>(null);
  const truncate = (str: string, max: number) => {
    return str.length > max ? str.substring(0, max - 3) + "..." : str;
  };

  const startTimer = () => {
    if (films.length === 0) return;
    clearTimer();
    timerRef.current = setInterval(() => {
      setState((prev) => {
        const nextIdx =
          prev.filmCurrentIdx === films.length - 1
            ? 0
            : prev.filmCurrentIdx + 1;
        return { ...prev, filmCurrentIdx: nextIdx };
      });
    }, duration);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const onFilmButtonSelected = (idx: number) => {
    clearTimer();
    setState((prevState) => {
      return {
        ...prevState,
        filmCurrentIdx: idx,
      };
    });
  };

  useEffect(() => {
    if (films.length === 0) return;
    if (timerRef.current == null) {
      startTimer();
    }
    return () => clearTimer();
  }, [state.filmCurrentIdx, films.length]);

  const displayFilm = useMemo(
    () => films[state.filmCurrentIdx],
    [state.filmCurrentIdx, films],
  );

  const getNewestEpisodes = (film: Film, epDisplayNumber: number = 3) => {
    const max = epDisplayNumber;
    if (film.episodes) {
      const eps = film.episodes.slice(-max);
      return eps;
    }
    return [];
  };

  const getTrailerUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const v = urlObj.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      if (urlObj.hostname.includes("youtu.be")) return `https://www.youtube.com/embed${urlObj.pathname}`;
    } catch (e) {
      // Fallback
    }
    return url.replace("watch?v=", "embed/");
  };

  useEffect(() => {
    if (switchRef.current) {
      switchRef.current.style.setProperty(
        "--progress-duration",
        `${duration / SECOND}s`,
      );
    }
    if (films.length === 0) return;
    startTimer();
    return () => clearTimer();
  }, []);

  const handleIsDisplayed = (filmId: string) => {
    return filmId == displayFilm?.id;
  };

  const { trailerVisible } = state;

  useEffect(() => {
    if (trailerVisible) {
      clearTimer();
    } else {
      startTimer();
    }
  }, [trailerVisible]);

  if (!films || films.length === 0) {
    return null;
  }

  return (
    <div
      className={`relative justify-between w-full h-full rounded-2xl bg-transparent overflow-hidden shadow-2xl`}
    >
      {films.map((f) => (
        <BannerCard
          key={f.id}
          firstEpId={f.episodes?.[0].id}
          isDisplayed={handleIsDisplayed}
          filmId={f.id}
          bannerUrl={f.bannerUrl}
          logoUrl={f.logoUrl}
          title={f.title}
          description={truncate(f.description ?? "", 120)}
          totalOfEpisodes={f.numberOfEpisodes ?? 0}
          interests={f.interests}
          newestEpisodes={getNewestEpisodes(f)}
          numberOfCurrentEpisode={f.numberOfCurrentEpisodes ?? 0}
          watchTrailer={() =>
            setState((prev) => ({ ...prev, trailerVisible: true }))
          }
        />
      ))}

      {/* Banner Slider Switch */}
      <div
        className="absolute flex flex-col items-center justify-center gap-3 md:gap-4 right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 drop-shadow-xl"
        ref={switchRef}
      >
        {films.map((f, index) => (
          <div
            className={`rounded-full relative w-1.5 md:w-2 transition-all outline-none cursor-pointer overflow-hidden origin-center flex bg-white/40 hover:bg-white/80 backdrop-blur-sm shadow-lg ${index === state.filmCurrentIdx
              ? `h-12 md:h-16 after:w-full after:block after:content-[''] after:bg-orange-500 after:transition-all after:ease-linear animateProgressY`
              : "h-3 md:h-4"
              } `}
            key={f.id}
            onClick={() => onFilmButtonSelected(index)}
          ></div>
        ))}
      </div>

      <div
        className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${trailerVisible ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      >
        <button
          className="cursor-pointer absolute top-6 right-6 lg:top-10 lg:right-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-500 text-white text-2xl font-bold transition-all"
          onClick={() => {
            setState((prev) => ({ ...prev, trailerVisible: false }));
          }}
        >
          &times;
        </button>
        {displayFilm?.trailerUrl && (
          <div className="w-[90vw] md:w-[80vw] lg:w-[60vw] max-w-6xl aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black">
            <iframe
              className="aspect-video w-full h-full"
              src={getTrailerUrl(displayFilm.trailerUrl)}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen={true}
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
}
