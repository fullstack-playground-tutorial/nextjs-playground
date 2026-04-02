import Image from "next/image";

import { Breadcrumb } from "./components/Breadcrumb";

import WrapperItem from "./components/WrapperItem";
import Banner from "./components/BannerSlider";
import Carousel from "./components/Carousel";
import { NewestFilmCarouselItem } from "./components/FilmCarouselItem";
import CountdownTimer from "./components/CountdownTimer";
import { getFilmService } from "@/app/core/server/context";
import { config } from "@/app/config";
import { Film } from "@/app/feature/film";
import Link from "next/link";

export default async function Page() {

  const newestFilms = await getFilmService()
    .search({
      sort: "publishedAt",
      limit: 4,
    });

  const hotFilms = await getFilmService().search({ limit: 12 });
  const monthFilms = await getFilmService().search({ sort: "-publishedAt", limit: 12 });
  const seasonFilms = await getFilmService().search({ sort: "publishedAt", limit: 12 });

  // simulation for top rankings (1-10)
  const rankingFilmsResult = await getFilmService().search({ limit: 10 });

  // mock release dates for upcoming films (next 7-30 days)
  const upcomingFilms = hotFilms.list.slice(0, 6).map((f, i) => ({
    ...f,
    releaseDate: new Date(Date.now() + (i + 5) * 24 * 60 * 60 * 1000 + (10 * 60 * 60 * 1000)).toISOString(),
  }));

  // ensure we have 10 items for mockup demonstration
  const rankingList = Array.from({ length: 10 }).map((_, i) => {
    const original = rankingFilmsResult.list[i % (rankingFilmsResult.list.length || 1)];
    if (original) {
      return {
        ...original,
        id: `${original.id}-mock-${i}`,
        title: `${original.title} #${i + 1}`,
      } as Film;
    }
    return {
      id: `mock-${i}`,
      title: `Siêu Phẩm Phim ${i + 1}`,
      slug: `sieu-pham-phim-${i}`,
      posterUrl: "",
      interests: [],
      interestIds: []
    } as Film;
  });

  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("blob:") || url.startsWith("data:") || url.startsWith("http")) return url;
    return `${config.image_url_host}/${url}.image/webp.webp`;
  };

  const renderRankingGrid = (title: string, films: Film[]) => (
    <div className="relative mb-24 group/ranking mt-12">
      <div className="flex items-center justify-between mb-16">
        <div className="flex items-baseline gap-10">
          <h2 className="text-4xl font-black tracking-tighter uppercase text-white drop-shadow-2xl italic">
            {title}
          </h2>
          <div className="flex gap-8 text-sm font-bold uppercase tracking-widest text-white/30">
            <span className="text-accent-0 cursor-pointer hover:text-accent-0 transition-colors underline underline-offset-8">Tuần này</span>
            <span className="cursor-pointer hover:text-accent-0 transition-colors">Tháng</span>
            <span className="cursor-pointer hover:text-accent-0 transition-colors">Mùa</span>
            <span className="cursor-pointer hover:text-accent-0 transition-colors">Năm</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-32 gap-x-24 pl-28 pr-12">
        {films.map((f, index) => {
          const rank = index + 1;
          const isDoubleDigit = rank >= 10;
          return (
            <Link key={f.id} href={`/films/${f.slug}-${f.id}`} className="flex items-end group/item cursor-pointer relative">
              {/* Background Number */}
              <div
                className={`absolute bottom-[-15%] select-none z-0 transition-transform duration-500 group-hover/item:-translate-x-4 ${isDoubleDigit ? "-left-32" : "-left-24"
                  }`}
              >
                <span className="font-black text-transparent stroke-white/20 drop-shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all duration-500 group-hover/item:stroke-accent-0 text-[240px] tracking-[-0.15em] leading-none"
                  style={{ WebkitTextStroke: "5px rgba(255, 255, 255, 0.4)" }}>
                  {rank}
                </span>
              </div>

              {/* Poster Card */}
              <div className="relative z-10 w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-[40px_40px_80px_rgba(0,0,0,0.8)] transition-all duration-500 group-hover/item:scale-105 group-hover/item:-translate-y-8 border border-white/10 group-hover/item:border-accent-0 bg-surface-1">
                <img
                  src={getImageUrl(f.posterUrl || "")}
                  alt={f.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover/item:brightness-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/20 to-transparent opacity-90 transition-opacity group-hover/item:opacity-70" />

                {/* Content Info */}
                <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-6 opacity-0 group-hover/item:translate-y-0 group-hover/item:opacity-100 transition-all duration-700">
                  <p className="text-white font-black text-xl line-clamp-1 truncate drop-shadow-2xl">{f.title}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="w-10 h-[3px] bg-accent-0"></span>
                    <p className="text-accent-0 text-sm font-black uppercase tracking-[0.3em]">Hạng {rank}</p>
                  </div>
                </div>

                {/* Top Badge */}
                <div className="absolute top-5 right-5 shadow-2xl">
                  <div className="bg-red-600 text-white text-[12px] font-black px-4 py-1.5 rounded-sm uppercase tracking-tighter ring-1 ring-white/30 shadow-2xl scale-125">
                    TOP {rank}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );

  const renderUpcomingGrid = (title: string, films: (Film & { releaseDate: string })[]) => (
    <div className="relative mb-24">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-4xl font-black tracking-tighter uppercase text-white drop-shadow-2xl">
          {title}
        </h2>
        <div className="flex items-center gap-2 text-accent-0 animate-pulse">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-0 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-0"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-widest">Sắp ra mắt</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {films.map((f) => (
          <Link href={`/films/${f.slug}-${f.id}`} key={f.id} className="group relative bg-surface-1 rounded-2xl overflow-hidden border border-white/5 hover:border-accent-0/50 transition-all duration-500 shadow-2xl">
            <div className="aspect-video relative overflow-hidden">
              <img
                src={getImageUrl(f.bannerUrl || f.posterUrl || "")}
                alt={f.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Countdown Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white font-bold text-lg mb-1 drop-shadow-lg">{f.title}</p>
                <CountdownTimer targetDate={f.releaseDate} />
              </div>

              {/* Pre-order Badge */}
              <div className="absolute top-4 right-4 bg-accent-0 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-xl">
                Reminder me
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  const renderFilmGrid = (title: string, films: Film[], accentColor: string = "text-accent-0") => (
    <div className="relative mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-3xl font-bold tracking-wider uppercase ${accentColor} drop-shadow-md`}>
          {title}
        </h2>
        <a href="#" className="text-sm font-medium hover:text-accent-0 transition-colors uppercase tracking-wide">Xem tất cả &rarr;</a>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {films.map((f) => (
          <Link href={`/films/${f.slug}-${f.id}`} key={f.id} className="snap-start flex-none w-[220px] group cursor-pointer">
            <div className="relative overflow-hidden rounded-xl shadow-lg aspect-[2/3] bg-surface-1 mb-3 transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:-translate-y-2">
              <img
                src={getImageUrl(f.posterUrl || "")}
                alt={f.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 w-full">
                  <p className="text-white font-bold line-clamp-2 leading-tight drop-shadow-md text-sm">{f.title}</p>
                  <p className="text-white/80 text-xs mt-1 drop-shadow-md font-medium">2026 • Full HD</p>
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-[16px] text-primary group-hover:text-accent-0 transition-colors line-clamp-1">{f.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );

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
          ]}
          className="px-2 py-1"
        />
      </div>
      <div>
        <div className="h-[80vh] min-h-[450px] md:min-h-[600px] w-full relative">
          <Banner duration={3000} films={newestFilms.list.map((f) => ({
            ...f,
            bannerUrl: getImageUrl(f.bannerUrl || ""),
            logoUrl: getImageUrl(f.logoUrl || ""),
          }))} />
        </div>
        <Carousel
          ItemElement={NewestFilmCarouselItem}
          items={newestFilms.list.map((f) => ({
            ...f,
            bannerUrl: getImageUrl(f.bannerUrl || ""),
            logoUrl: getImageUrl(f.logoUrl || ""),
          }))}
          visibleCount={4}
          Loading={<div className="text-accent-0 font-bold animate-pulse">ĐANG TẢI...</div>}
          className="w-full -mt-32 md:-mt-48 z-20 pb-10"
        />

        {/* Tiếp Tục Xem Phim Section */}
        <div className="dark:bg-surface-2/60 backdrop-blur-md rounded-2xl dark:border dark:border-border-subtle p-6 mt-10 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold tracking-wider uppercase text-accent-0 drop-shadow-md">
              TIẾP TỤC XEM PHIM
            </h2>
            <a href="#" className="text-sm font-medium hover:text-accent-0 transition-colors uppercase tracking-wide">Xem tất cả &rarr;</a>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {newestFilms.list.map((f) => (
              <Link href={`/films/${f.slug}-${f.id}`} key={f.id} className="snap-start flex-none w-[200px] group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl shadow-lg aspect-[2/3] bg-surface-1 mb-3 transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:-translate-y-1">
                  <Image
                    src={getImageUrl(f.posterUrl || "")}
                    alt={f.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    fill
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="inline-block px-2 py-1 bg-accent-0 text-white text-[10px] font-bold rounded mb-2 uppercase tracking-wider">Đang xem 45%</span>
                      <p className="text-white font-bold line-clamp-2 leading-tight text-sm">{f.title}</p>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-[15px] dark:text-primary group-hover:text-accent-0 transition-colors line-clamp-1">{f.title}</h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Rankings - Netflix Style */}
        {renderRankingGrid("Bảng Xếp Hạng", rankingList)}

        {/* Phim Sắp Chiếu */}
        {renderUpcomingGrid("Phim Sắp Chiếu", upcomingFilms)}

        {/* Phim Hot */}
        {renderFilmGrid("Phim Hot Nhất", hotFilms.list, "text-red-500")}

        {/* Phim Trong Tháng */}
        {renderFilmGrid("Phim Trong Tháng", monthFilms.list, "text-blue-400")}

        {/* Phim Theo Mùa */}
        {renderFilmGrid("Phim Cho Mùa Này", seasonFilms.list, "text-green-400")}
      </div>
      <footer className="w-full mt-24 p-10 dark:bg-surface-1/80 backdrop-blur-xl dark:text-text-subtle text-center rounded-2xl border border-border-subtle shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
        <h2 className="text-3xl font-black dark:text-primary mb-3 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-accent-0 to-purple-500">CINEMATIC</h2>
        <p className="text-sm font-medium">Trải nghiệm xem phim đỉnh cao.</p>
        <p className="text-xs mt-6 opacity-60">© 2026 Cinematic. Tất cả các quyền được bảo lưu.</p>
        <div className="flex justify-center gap-8 mt-8">
          <a href="#" className="hover:text-accent-0 transition-all hover:scale-105 text-sm font-semibold uppercase tracking-wider">Chính sách bảo mật</a>
          <a href="#" className="hover:text-accent-0 transition-all hover:scale-105 text-sm font-semibold uppercase tracking-wider">Điều khoản sử dụng</a>
          <a href="#" className="hover:text-accent-0 transition-all hover:scale-105 text-sm font-semibold uppercase tracking-wider">Liên hệ</a>
        </div>
      </footer>
    </div>
  );
}
