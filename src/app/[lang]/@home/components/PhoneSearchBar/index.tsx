"use client";

import { InternalizationContext } from "@/app/core/client/store/internalization/InternalizationContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { use, useState } from "react";

interface Props {
  hidden: boolean;
}

interface InternalState {
  searchText: string;
}

const initialState: InternalState = {
  searchText: "",
};
export default function PhoneSearchBar(props: Props) {
  const [state, setState] = useState(initialState);
  const internalizationContext = use(InternalizationContext);
  const router = useRouter();
  const pathname = usePathname();
  const onChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setState((prev) => ({
      ...prev,
      searchText: e.target.value,
    }));
  };

  const handleSearch = (term: string) => {
    const searchParams = new URLSearchParams({
      q: state.searchText,
    });

    const searchUrl = `/${internalizationContext?.internalization.currentLocale ?? "vi-VN"}/search?${searchParams.toString()}`;
    router.replace(searchUrl);
  }

  const onSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleSearch(state.searchText)
  };

  return (
    !props.hidden && (
      <div className="flex flex-col-reverse gap-2 min-w-64 items-center p-1">
        <form className="flex flex-row z-50 px-2 py-1 outline-none rounded-full bg-white text-black border gap-2 items-center">
          <input
            type="text"
            className="h-full outline-none flex-1"
            placeholder="Search something here ..."
            value={state.searchText}
            onChange={(e) => onChangeSearchInput(e)}
          />
          <button
            type="submit"
            className="flex justify-center items-center"
            onClick={(e) => onSearch(e)}
          >
            <div className="flex items-center rounded-full justify-center p-1 shadow-md ml-1 w-8 scroll-smooth">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-2 h-full w-full stroke-blue-300"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
              </svg>
            </div>
          </button>
        </form>
        <div
          className={`flex flex-col bg-white rounded-2xl overflow-auto border w-full p-2 overflow-y-clip ${
            state.searchText.length == 0 ? "hidden" : ""
          }`}
        >
          <div className="p-2">test 1</div>
          <div className="p-2">test 1</div>
          <div className="p-2">test 1</div>
          <div className="p-2">test 1</div>
          <div className="p-2">test 1</div>
          <div className="p-2">test 1</div>
        </div>
      </div>
    )
  );
}
