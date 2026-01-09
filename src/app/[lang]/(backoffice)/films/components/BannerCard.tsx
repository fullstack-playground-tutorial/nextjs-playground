import { Episode, Interest } from "@/app/feature/film";
import Link from "next/link";

interface Props {
  filmId: string;
  firstEpId?: string;
  bannerUrl: string;
  logoUrl?: string;
  title: string;
  description?: string;
  totalOfEpisodes: number;
  interests: Interest[];
  newestEpisodes: Episode[];
  numberOfCurrentEpisode: number;
  watchTrailer: () => void;
  isDisplayed: (filmId: string) => boolean;
}

export default function BannerCard({
  logoUrl,
  firstEpId,
  title,
  description,
  totalOfEpisodes,
  interests,
  numberOfCurrentEpisode,
  filmId,
  newestEpisodes,
  bannerUrl,
  watchTrailer,
  isDisplayed,
}: Props) {
  const renderNewestEpisodes = () => {
    return (
      <>
        {newestEpisodes.map((item) => (
          <Link
            key={item.id}
            href={`/cinematic/details/${filmId}/${item.id}`}
            className="border rounded border-gray-500 hover:bg-white hover:text-orange-600 transition text-sm px-2 flex items-center justify-center cursor-pointer shadow-md"
          >
            {item.title}
          </Link>
        ))}
      </>
    );
  };
  return (
    <div
      style={
        {
          "--img-url": `url(${bannerUrl})`,
        } as React.CSSProperties
      }
      className={`absolute h-full w-full left-0 top-0 overflow-hidden bg-[size:cover] z-0 rounded-lg bg-[image:var(--img-url)] transition-opacity duration-1000 ${
        isDisplayed(filmId) ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute h-full bottom-0 left-0 flex flex-col justify-end w-full from-black to-transparent bg-gradient-to-t"></div>
      <div className="absolute right-0 top-0 h-full w-1/4 justify-center items-center p-4 bg-gradient-to-l from-black/60 to-black/transparent rounded-lg ">
        {/* film info */}
        <div className="flex flex-col h-full gap-2 text-shadow-sm text-center my-auto tracking-tight text-gray-200">
          <img
            src={logoUrl}
            alt="logo"
            className=" h-1/3 object-contain drop-shadow-2xl"
          />
          <p
            className="text-3xl text-white font-semibold capitalize"
            id="title"
          >
            {title}
          </p>
          <p className="text-base font-medium text-justify text-shadow-sm w-full h-24 overflow-hidden text-ellipsis">
            {description}
          </p>
          {totalOfEpisodes && (
            <p className="self-start text-sm">
              <span className="font-semibold">Episodes:</span>{" "}
              {numberOfCurrentEpisode}/{totalOfEpisodes}
            </p>
          )}
          <div className="flex flex-row gap-2 items-center flex-wrap">
            <span className="font-semibold text-sm">Interests: </span>
            {interests.map((item) => (
              <a
                key={item.id}
                className="border border-gray-400 font-semibold text-sm rounded-full px-2 cursor-pointer hover:bg-white hover:text-orange-500 shadow-md"
              >
                {item.title}
              </a>
            ))}
          </div>
          {newestEpisodes.length > 0 && (
            <div className="flex flex-row gap-2 items-center flex-wrap">
              <span className="font-semibold text-sm">Newest episodes: </span>
              {renderNewestEpisodes()}
            </div>
          )}
          {/* button groups */}
          <div className="flex flex-row gap-4 justify-center">
            <button
              className="text-medium min-w-32 cursor-pointer font-semibold px-3 py-2 text-white border hover:border-white border-gray-400 rounded-full transition hover:text-orange-500 hover:bg-white"
              onClick={watchTrailer}
            >
              Trailer
            </button>
            {numberOfCurrentEpisode > 0 && (
              <Link
                href={`/cinematic/details/${filmId}/${firstEpId}`}
                className="flex text-medium items-center justify-center min-w-32 cursor-pointer font-semibold px-3 py-2 bg-orange-500 text-white rounded-full hover:bg-gray-700 hover:font-bold hover:text-white transition"
              >
                Watch
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
