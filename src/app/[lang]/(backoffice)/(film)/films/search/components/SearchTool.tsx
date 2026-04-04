"use client";

import { FilmInterest } from "@/app/feature/film-interest";
import { FilterDropdown, SearchBar } from "@/components/Search";
import { usePathname, useRouter } from "next/navigation";
import FloatInput from "../../../../components/FloatInput";
import { useState } from "react";
import DropdownIcon from "@/app/components/Search/arrow_down.svg";
import SearchIcon from "@/app/components/Search/search.svg";
import { FilmFilter } from "@/app/feature/film";

type Props = {
    interests: FilmInterest[];
    searchParams: {
        q?: string;
        page?: string;
        sort?: string;
        limit?: string;
        interestIds?: string;
        fromYear?: string;
        toYear?: string;
    };
};

type InternalState = {
    sort: string;
    selectedInterestIDs: string[];
    fromYear?: string;
    toYear?: string;
    q?: string;
    collapsed: boolean;
}


const sortOptions = [
    { value: "likeTotal", title: "Yêu thích nhất" },
    { value: "totalView", title: "Xem nhiều nhất" },
    { value: "createdAt", title: "Mới nhất" },
    { value: "rating", title: "Đánh giá cao nhất" },
];

export default function SearchTool({ interests, searchParams }: Props) {
    const pathname = usePathname();
    const { replace } = useRouter();
    const [state, setState] = useState<InternalState>({
        sort: searchParams.sort || "createdAt",
        selectedInterestIDs: searchParams.interestIds?.split(",") || [],
        fromYear: searchParams.fromYear?.toString(),
        toYear: searchParams.toYear?.toString(),
        q: searchParams.q,
        collapsed: false
    })

    const handleItemSelected = (value: string) => {
        setState({
            ...state,
            sort: value
        });
    }

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (state.q) params.set("q", state.q);
        if (state.sort) params.set("sort", state.sort);
        if (state.selectedInterestIDs.length > 0) params.set("interests", state.selectedInterestIDs.join(","));
        if (state.fromYear) params.set("fromYear", state.fromYear);
        if (state.toYear) params.set("toYear", state.toYear);
        replace(`${pathname}?${params.toString()}`);
    }

    const handleInterestChange = (interest: string) => {
        setState({
            ...state,
            selectedInterestIDs: state.selectedInterestIDs.includes(interest) ? state.selectedInterestIDs.filter((i) => i !== interest) : [...state.selectedInterestIDs, interest]
        });
    }

    const handleFromYearChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setState({
            ...state,
            fromYear: e.target.value
        });
    }

    const handleToYearChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setState({
            ...state,
            toYear: e.target.value
        });
    }

    const handleQChange = (q: string) => {
        setState({
            ...state,
            q: q
        });
    }

    const handleYearChange = (year: number) => {
        setState({
            ...state,
            fromYear: year.toString(),
            toYear: year.toString()
        });
    }

    const handleToggleCollapsed = () => {
        setState({
            ...state,
            collapsed: !state.collapsed
        });
    }

    const { selectedInterestIDs: selectedInterests, fromYear, toYear, q, collapsed } = state;

    return (
        <div className="w-full mb-8 transition-all duration-500 ease-in-out">
            {/* Header Trigger */}
            <div
                className={`flex items-center justify-between px-6 py-4 rounded-2xl cursor-pointer transition-all duration-300 shadow-lg 
                    dark:bg-surface-1/70 dark:backdrop-blur-xl dark:border dark:border-white/10 
                    hover:bg-surface-2/80 hover:border-accent-0 hover:-translate-y-0.5 hover:shadow-2xl group
                    ${collapsed ? 'ring-1 ring-accent-0/40' : ''}`}
                onClick={handleToggleCollapsed}
            >
                <div className="flex items-center gap-3 text-lg font-semibold tracking-wide dark:text-primary">
                    <SearchIcon className={`size-5 transition-colors duration-300 group-hover:text-accent-0 ${collapsed ? 'text-accent-0' : 'fill-current'}`} />
                    <span>Bộ lọc tìm kiếm</span>
                </div>
                <div className={`transition-transform duration-500 ease-out ${collapsed ? 'rotate-180 text-accent-0' : 'text-secondary group-hover:text-primary'}`}>
                    <DropdownIcon className="size-6 fill-current" />
                </div>
            </div>

            {/* Content Panel */}
            <div className={`grid transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-2xl ${collapsed ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'}`}>
                <div className={`p-8 rounded-[2rem] 
                        dark:bg-surface-1/80 dark:border dark:border-white/10 
                        transform-gpu transition-all duration-700 delay-75
                        ${collapsed ? 'translate-y-0 scale-100' : '-translate-y-4 scale-[0.98]'}`}
                >
                    {/* Search Bar & Sort Row */}
                    < div className="flex flex-col md:flex-row gap-6 mb-8 w-full items-start">
                        <div className="flex-1 w-full scale-100 hover:scale-[1.01] transition-transform duration-300">
                            <SearchBar placeHolder="Bạn muốn xem phim gì hôm nay?..." keyword={q || ""} onSearch={handleSearch} onQueryChange={handleQChange} />
                        </div>
                        <div className="w-full md:w-auto">
                            <FilterDropdown placeHolder="Sắp xếp theo" selectedList={sortOptions} onItemSelected={handleItemSelected} />
                        </div>
                    </div>

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

                    {/* Genres Section */}
                    <div className="mb-8">
                        <span className="block font-semibold mb-5 dark:text-primary/90 tracking-widest uppercase text-[10px] opacity-60">Thể loại</span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {interests.map((interest) => (
                                <label key={interest.id} className="relative cursor-pointer group h-full select-none">
                                    <input
                                        type="checkbox"
                                        className="peer absolute opacity-0 w-0 h-0"
                                        value={interest.id}
                                        checked={selectedInterests.includes(interest.id)}
                                        onChange={() => handleInterestChange(interest.id)}
                                    />
                                    <span className="flex items-center justify-center px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-secondary transition-all duration-300 text-center h-full 
                                            group-hover:bg-white/10 group-hover:border-white/10 
                                            peer-checked:bg-accent-0 peer-checked:text-white peer-checked:border-accent-0 peer-checked:font-bold peer-checked:shadow-[0_8px_20px_rgba(255,145,0,0.3)]">
                                        {interest.title}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

                    {/* Year Section */}
                    <div className="mb-8">
                        <span className="block font-semibold mb-5 dark:text-primary/90 tracking-widest uppercase text-[10px] opacity-60">Năm phát hành</span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 items-stretch">
                            {Array.from({ length: 7 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                <label key={year} className="relative cursor-pointer group select-none">
                                    <input
                                        type="radio"
                                        name="year-select"
                                        className="peer absolute opacity-0 w-0 h-0"
                                        value={year}
                                        checked={fromYear === year.toString() && toYear === year.toString()}
                                        onChange={() => handleYearChange(year)}
                                    />
                                    <span className="flex items-center justify-center px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-secondary transition-all duration-300 text-center h-full
                                            group-hover:bg-white/10 group-hover:border-white/10 
                                            peer-checked:bg-accent-0 peer-checked:text-white peer-checked:border-accent-0 peer-checked:font-bold peer-checked:shadow-[0_8px_20px_rgba(255,145,0,0.3)]">
                                        {year}
                                    </span>
                                </label>
                            ))}

                            <div className="col-span-full flex flex-col sm:flex-row items-center gap-6 bg-white/5 p-5 rounded-2xl border border-dashed border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 mt-4">
                                <span className="text-[10px] font-black text-accent-0 whitespace-nowrap uppercase tracking-[0.3em] px-2 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent-0 animate-pulse" />
                                    Tuỳ chỉnh
                                </span>
                                <div className="flex gap-6 w-full h-14">
                                    <FloatInput type="number" disabled={false} name="fromYear" label="Từ năm" value={fromYear || ""} onChange={handleFromYearChange} />
                                    <FloatInput type="number" disabled={false} name="toYear" label="Đến năm" value={toYear || ""} onChange={handleToYearChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Bổ sung search theo quốc gia, phim movie, tv series, độ tuổi cho phép, độ phân giải */}

                    {/* Submit Button */}
                    <div className="flex justify-center mt-12">
                        <button
                            type="button"
                            onClick={handleSearch}
                            className="group/btn relative bg-gradient-to-br from-accent-0 to-[#ff9100] text-white px-20 py-4 rounded-2xl font-bold text-base transition-all duration-500 
                                    shadow-[0_15px_35px_rgba(255,145,0,0.3)] hover:-translate-y-1.5 hover:scale-105 hover:shadow-[0_25px_50px_rgba(255,145,0,0.5)] 
                                    active:translate-y-0 active:scale-95 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Áp dụng bộ lọc
                                <DropdownIcon className="size-5 -rotate-90 fill-current opacity-50 group-hover/btn:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
}
