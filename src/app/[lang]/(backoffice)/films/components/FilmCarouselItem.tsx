"use client";
import { Film } from "@/app/feature/film";

export const NewestFilmCarouselItem = ({ item }: { item: Film }) => {
  return (
    <div className="relative flex flex-col rounded items-center justify-center w-70 h-90 content-center mx-auto">
      <img src={item.imageURLs?.[0]} className="object-cover h-full rounded" />
      <div className="tracking-tighter absolute bottom-0 left-0 h-full w-full content-end font-semibold text-lg">
        {item.title}
      </div>
    </div>
  );
};
