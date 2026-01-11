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
    [state.filmCurrentIdx, films]
  );

  const getNewestEpisodes = (film: Film, epDisplayNumber: number = 3) => {
    const max = epDisplayNumber;
    if (film.episodes) {
      const eps = film.episodes.slice(-max);
      return eps;
    }
    return [];
  };

  useEffect(() => {
    if (switchRef.current) {
      switchRef.current.style.setProperty(
        "--progress-duration",
        `${duration / SECOND}s`
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
      className={`relative justify-between w-full gap-4 mt-2 h-full rounded-t-lg bg-transparent`}
    >
      {films.map((f) => (
        <BannerCard
          key={f.id}
          firstEpId={f.episodes?.[0].id}
          isDisplayed={handleIsDisplayed}
          filmId={f.id}
          bannerUrl={f.imageURLs[0]}
          logoUrl={f.logoUrl}
          title={f.title}
          description={truncate(f.description ?? "", 120)}
          totalOfEpisodes={f.episodes?.length ?? 0}
          interests={f.interests}
          newestEpisodes={getNewestEpisodes(f)}
          numberOfCurrentEpisode={f.episodes?.length ?? 0}
          watchTrailer={() =>
            setState((prev) => ({ ...prev, trailerVisible: true }))
          }
        />
      ))}

      {/* Banner Slider Switch */}
      <div
        className="absolute flex flex-col items-center justify-center gap-4 left-0 top-1/2 -translate-y-1/2 ml-4"
        ref={switchRef}
      >
        {films.map((f, index) => (
          <div
            className={`rounded-full relative w-2 transition-all origin-center flex bg-gray-400 ${
              index === state.filmCurrentIdx
                ? `h-16 rounded overflow-hidden after:w-full after:block after:content-[''] after:bg-orange-600 after:transition-all after:ease-linear animateProgress after:animate-pulse`
                : "h-2"
            } `}
            key={f.id}
            onClick={() => onFilmButtonSelected(index)}
          ></div>
        ))}
      </div>

      {/* Youtube */}
      <div
        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
        hidden={!trailerVisible}
      >
        <button
          className="cursor-pointer absolute top-4 right-4 text-white text-3xl font-bold hover:text-red-500"
          onClick={() => {
            setState((prev) => ({ ...prev, trailerVisible: false }));
          }}
        >
          &times;
        </button>
        {displayFilm?.sources && (
          <div className="w-[50vw] max-w-5xl aspect-video">
            <iframe
              className="aspect-video w-full h-full"
              src={displayFilm.sources[0].sourceUrls["auto"] || ""}
              title="YouTube video player"
              frameBorder="0"
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
