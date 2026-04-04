"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SearchBar } from "@/components/Search";
import { Tag } from "@/app/feature/tags";
import { useRouter } from "next/navigation";

type Interests = {
  list: Tag[];
  total: number;
};

type NavbarProps = {
  interests: Interests;
  logo?: React.ReactNode;
};

const Navbar = ({ interests, logo }: NavbarProps) => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const generateSeasons = () => {
    const result = [];
    // Currently following user's hint: Mùa xuân 2026, Mùa đông 2026, then 2025 downwards
    result.push({ label: "Mùa xuân 2026", href: "/films?season=spring&year=2026" });
    result.push({ label: "Mùa đông 2026", href: "/films?season=winter&year=2026" });

    const years = [];
    for (let y = 2025; y >= 2016; y--) {
      years.push(y);
    }

    const seasonNames = ["Thu", "Hạ", "Xuân", "Đông"];
    years.forEach(y => {
      seasonNames.forEach(s => {
        result.push({
          label: `Mùa ${s.toLowerCase()} ${y}`,
          href: `/films?season=${s.toLowerCase()}&year=${y}`
        });
      });
    });
    return result;
  };

  const seasonalItems = generateSeasons();

  const genreItems = interests.list.map(interest => ({
    label: interest.title,
    href: `/films?interest=${interest.slug}`
  }));

  const topFilmItems = [
    { label: "Yêu thích nhất", href: "/films?sort=likes" },
    { label: "Xem nhiều nhất", href: "/films?sort=views" }
  ];

  return (
    <nav
      className={`sticky top-0 z-[50] transition-all duration-500 border-b border-white/5 py-4 mb-6 bg-surface-1/40 backdrop-blur-md shadow-sm rounded-2xl ${isScrolled ? "shadow-[0_10px_30px_rgba(0,0,0,0.4)] border-white/10" : ""
        }`}
    >
      <div className="max-w-full mx-auto px-6 flex items-center justify-between">
        {/* Logo (Optional) */}
        <div className="flex items-center gap-8">
          {logo && (
            <Link href="/films" className="group">
              {logo}
            </Link>
          )}

          {/* Main Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/films"
              className="px-4 py-2 text-sm font-bold uppercase tracking-widest text-white/70 hover:text-accent-0 transition-colors relative group"
            >
              Trang Chủ
              <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>

            {/* Thể loại Dropdown */}
            <div className="group relative">
              <button className="px-4 py-2 text-sm font-bold uppercase tracking-widest text-white/70 hover:text-accent-0 transition-colors flex items-center gap-1">
                Thể Loại
                <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 w-64 pt-3 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                <div className="bg-surface-1/90 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-4 grid grid-cols-2 gap-x-2 gap-y-1 max-h-[400px] overflow-y-auto custom-scrollbar relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-0/40 to-transparent"></div>
                  {genreItems.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      className="px-3 py-2 text-xs font-bold text-white/50 hover:text-accent-0 hover:bg-accent-0/5 rounded-lg transition-all duration-300 flex items-center gap-2 group/item"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover/item:bg-accent-0 transition-colors shadow-[0_0_8px_transparent] group-hover/item:shadow-accent-0/50"></span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Phim theo mùa Dropdown */}
            <div className="group relative">
              <button className="px-4 py-2 text-sm font-bold uppercase tracking-widest text-white/70 hover:text-accent-0 transition-colors flex items-center gap-1">
                Phim Theo Mùa
                <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 w-72 pt-3 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                <div className="bg-surface-1/90 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-4 grid grid-cols-2 gap-x-3 gap-y-1 max-h-[440px] overflow-y-auto custom-scrollbar relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-0/40 to-transparent"></div>
                  {seasonalItems.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      className="px-3 py-2 text-[10px] uppercase tracking-wider font-black text-white/40 hover:text-accent-0 hover:bg-accent-0/5 rounded-lg transition-all duration-300 flex items-center justify-between group/item"
                    >
                      {item.label}
                      <span className="w-1 h-1 rounded-full bg-white/10 group-hover/item:bg-accent-0 transition-colors"></span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Phim Hàng Đầu Dropdown */}
            <div className="group relative">
              <button className="px-4 py-2 text-sm font-bold uppercase tracking-widest text-white/70 hover:text-accent-0 transition-colors flex items-center gap-1">
                Phim Hàng Đầu
                <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 w-56 pt-3 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                <div className="bg-surface-1/90 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 flex flex-col">
                  {topFilmItems.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-accent-0 hover:bg-white/5 rounded-xl transition-all flex items-center gap-3"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-0"></span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Search & Profile */}
        <div className="flex items-center gap-6">
          <div className={`relative transition-all duration-500 flex items-center h-10 ${showSearch ? "w-64" : "w-10"}`}>
            {showSearch ? (
              <div className="w-full h-full animate-in fade-in slide-in-from-right-4 duration-300">
                <SearchBar placeHolder={"Tìm kiếm phim..."} onSearch={(q) => { router.push(`/films/search?q=${q}`); }} />
                <button
                  onClick={() => setShowSearch(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 text-white/70 hover:text-accent-0 hover:bg-white/5 rounded-full transition-all"
                aria-label="Search"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
          </div>

          <button className="hidden sm:flex items-center gap-3 px-1 py-1 rounded-full hover:bg-white/5 transition-all group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-0 to-purple-600 p-[2px]">
              <div className="w-full h-full rounded-full bg-surface-0 overflow-hidden border border-white/10">
                <img src="https://ui-avatars.com/api/?name=User&background=random" alt="User" />
              </div>
            </div>
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
