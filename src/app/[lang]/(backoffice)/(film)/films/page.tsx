import { SearchBar } from "@/components/Search";
import FilmIcon from "../../components/Sidebar/icons/film.svg";
import { Breadcrumb } from "./components/Breadcrumb";

import WrapperItem from "./components/WrapperItem";
import Banner from "./components/BannerSlider";
import Carousel from "./components/Carousel";
import { NewestFilmCarouselItem } from "./components/FilmCarouselItem";
import { getFilmService } from "@/app/core/server/context";
import { Film } from "@/app/feature/film";

export default async function Page() {
  // const newestFilms = await getFilmService()
  //   .search({
  //     sort: "publishedAt",
  //     limit: 4,
  //   })
  const newestFilms: Film[] = [];

  return (
    <div className="p-4 dark:bg-surface-0 h-screen dark:text-primary max-w-300 mx-auto flex flex-col">
      <div className="flex flex-row items-center">
        {/* Topbar */}
        <div className="flex flex-row justify-start items-center gap-2 w-full">
          <FilmIcon className="dark:fill-accent-0 mt-2 items-stretch size-20" />

          <h1 className="font-semibold underline underline-offset-10 dark:text-accent-0 text-5xl text-shadow-lg/50">
            CINEMATIC
          </h1>
        </div>
        <div className="self-end mb-4 h-8 w-70">
          <SearchBar placeHolder={"search film"} />
        </div>
      </div>
      <div className="p-1 font-semibold text-shadow-2xs mb-2 dark:text-accent-0">
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
          ]}
          className="px-2 py-1"
        />
      </div>
      <div>
        <div className="h-[100vh] w-full">
          <Banner duration={3000} films={newestFilms} />
        </div>
        <Carousel
          ItemElement={NewestFilmCarouselItem}
          items={newestFilms}
          visibleCount={4}
          Loading={"loading ..."}
          className=" w-full flex flex-row items-center justify-center rounded-b-lg p-4 -mt-[10%]"
        />
      </div>
    </div>
  );
}
