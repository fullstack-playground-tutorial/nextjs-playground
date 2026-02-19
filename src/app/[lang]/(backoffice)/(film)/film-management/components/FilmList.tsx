"use client";

import { SearchBar } from "@/components/Search";
import { startTransition, useMemo, useState } from "react";

import GridIcon from "../../../components/Sidebar/icons/grid_menu.svg";
import ListIcon from "../../../components/Sidebar/icons/menu.svg";
import FilmIcon from "../../../components/Sidebar/icons/film.svg";
import { Film } from "@/app/feature/film";
import Pagination from "@/components/Pagination";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { config } from "@/app/config";
import VideoCollectionIcon from "@/app/assets/images/icons/video_collection.svg";
import BinIcon from "@/app/assets/images/icons/bin.svg";
import EditIcon from "@/app/assets/images/icons/edit.svg";
import Link from "next/link";
import Image from "next/image";
export default function FilmList({
  data,
  limit,
  current,
}: {
  data: {
    list: Film[];
    total: number;
  };
  limit: number;
  current: number;
}) {
  const blurPlaceholder = 'data:image/png;base64,L042PFog4mV@%Mj[M{fk8^WB.9t7'
  const { list, total } = data;
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const { replace, push } = useRouter();
  const pathname = usePathname();

  const pageTotal = useMemo(() => {
    return Math.ceil(total / limit);
  }, [total, limit]);

  const filteredFilms = list.filter((film) =>
    film.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handlePageChange = (n: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", n + "");
    const newPath = `${pathname}?${params.toString()}`;
    startTransition(() => {
      replace(newPath, { scroll: false });
    });
  };

  const StatusBadge = ({ publishedAt }: { publishedAt?: Date }) => (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                ${publishedAt && publishedAt?.getTime() > Date.now()
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          : ""
        }
                ${publishedAt && publishedAt?.getTime() < Date.now()
          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
          : ""
        }
      ${publishedAt === undefined
          ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
          : ""
        }
    `}
    >
      {publishedAt && publishedAt?.getTime() > Date.now()
        ? "Published"
        : publishedAt && publishedAt?.getTime() < Date.now()
          ? "Draft"
          : "Coming Soon"}
    </span>
  );

  return (
    <div className="flex flex-col gap-2">
      {/* Toolbar */}
      <div className="flex flex-row justify-between items-center bg-surface-1 p-4 rounded-lg shadow-sm border dark:border-border">
        <div className="w-96">
          <SearchBar
            placeHolder="Search by title..."
            onQueryChange={(q) => setSearchTerm(q)}
          />
        </div>
        <div className="flex gap-2 items-center">
          {/* View Toggle */}
          <div className="flex bg-white dark:bg-surface-0 border dark:border-border rounded-md shadow-sm mr-4">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-l-md hover:bg-gray-50 dark:hover:bg-surface-1 ${viewMode === "list"
                ? "bg-gray-100 dark:bg-surface-2 text-accent-0"
                : "text-gray-500 dark:text-secondary"
                }`}
              title="List View"
            >
              <ListIcon className="size-5 fill-current" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-r-md hover:bg-gray-50 dark:hover:bg-surface-1 ${viewMode === "grid"
                ? "bg-gray-100 dark:bg-surface-2 text-accent-0"
                : "text-gray-500 dark:text-secondary"
                }`}
              title="Grid View"
            >
              <GridIcon className="size-5 fill-current" />
            </button>
          </div>

          <button className="px-3 py-2 text-sm font-medium border dark:border-border rounded hover:bg-surface-2 transition">
            Status: All
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {viewMode === "list" ? (
          <div className="overflow-x-auto rounded-lg border dark:border-border shadow">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-border">
              <thead className="bg-gray-50 dark:bg-surface-1">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-secondary uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-secondary uppercase tracking-wider"
                  >
                    Director
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-secondary uppercase tracking-wider"
                  >
                    Release Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-secondary uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-secondary uppercase tracking-wider"
                  >
                    Tags
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-secondary uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-surface-0 divide-y divide-gray-200 dark:divide-border">
                {filteredFilms.map((film) => (
                  <tr
                    key={film.id}
                    className="hover:bg-gray-50 dark:hover:bg-surface-1 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium dark:text-primary">
                        {film.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-secondary">
                        ID: {film.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm dark:text-secondary">
                        {film.director}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm dark:text-secondary">
                        {film.publishedAt?.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge publishedAt={film.publishedAt} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {film.interests.map((interests) => (
                          <span
                            key={interests.id}
                            className="text-xs bg-gray-100 dark:bg-surface-2 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300"
                          >
                            {interests.title}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-accent-0 hover:text-accent-1 mr-4">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredFilms.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-sm dark:text-secondary"
                    >
                      No films found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredFilms.map((film) => (
              <div
                key={film.id}
                className="bg-white dark:bg-surface-0 border dark:border-border rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
              >
                <div className="relative min-h-72">
                  {film.bannerUrl ? (
                    <div className="h-full hover:scale-105 transition  bg-gray-200 dark:bg-surface-1 flex items-center justify-center">
                      <Image
                        src={`${config.image_url_host}/${film.bannerUrl}.image/webp.webp`}
                        alt={film.title}
                        fill={true}
                        placeholder="blur"
                        objectFit="contain"
                        blurDataURL={blurPlaceholder}
                      />
                    </div>
                  ) : (
                    <div className="h-40 bg-gray-200 dark:bg-surface-1 flex items-center justify-center">
                      <FilmIcon className="size-16 fill-gray-400 dark:fill-secondary" />
                    </div>
                  )}
                  <div className="absolute top-1 right-1 flex flex-col gap-2">
                    <StatusBadge publishedAt={film.publishedAt} />
                  </div>
                  {/* Tags */}
                  <div className="absolute top-1 left-1 flex-wrap gap-1">
                    {film.interests.map((interests) => (
                      <span
                        key={interests.id}
                        className="text-xs bg-gray-100 dark:bg-surface-2 px-2 py-1 rounded text-gray-600 dark:text-gray-300"
                      >
                        {interests.title}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between flex-row-reverse gap-2 absolute bottom-0 left-0 right-0 p-1 w-full">
                    <div className="flex flex-row items-end gap-2">
                      <div className="flex items-center size-10 justify-center dark:hover:*:fill-primary bg-white dark:bg-surface-0/50 p-2 rounded-full dark:hover:bg-surface-1 cursor-pointer transition">
                        <EditIcon className="size-5 fill-gray-400 dark:fill-secondary" />
                      </div>
                      <Link
                        href={`/film-management/playlist?list=${film.id}`}
                        className="flex items-center size-10 justify-center dark:hover:*:fill-primary bg-white dark:bg-surface-0/50 p-2 rounded-full dark:hover:bg-surface-1 cursor-pointer transition"
                      >
                        <VideoCollectionIcon className="size-5 fill-gray-400 dark:fill-secondary" />
                      </Link>
                      <div className="flex items-center size-10 justify-center dark:hover:*:fill-primary bg-white dark:bg-surface-0/50 p-2 rounded-full dark:hover:bg-surface-1 cursor-pointer transition">
                        <BinIcon className="size-5 fill-gray-400 dark:fill-secondary" />
                      </div>
                    </div>
                    <div className="flex justify-between flex-auto">
                      <h3 className="font-serif text-xl tracking-tight dark:text-primary px-1.5 py-2 rounded backdrop-blur-xs">
                        {film.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredFilms.length === 0 && viewMode === "grid" && (
          <div className="p-10 text-center text-gray-500 dark:text-secondary">
            No films found matching "{searchTerm}"
          </div>
        )}
      </div>

      {/* Pagination Placeholder */}
      <div className="flex justify-between items-center pt-4 border-t dark:border-border">
        <span className="text-sm dark:text-secondary">
          Showing {filteredFilms.length} of {total} entries
        </span>
        {/* <div className="flex gap-1">
          <button
            className="px-3 py-1 border dark:border-border rounded disabled:opacity-50"
            disabled
          >
            Previous
          </button>
          <button className="px-3 py-1 bg-accent-0 text-white rounded">
            1
          </button>
          <button className="px-3 py-1 border dark:border-border rounded hover:bg-surface-1">
            2
          </button>
          <button className="px-3 py-1 border dark:border-border rounded hover:bg-surface-1">
            Next
          </button>
        </div> */}
        <Pagination
          total={pageTotal}
          currentPage={current}
          onPageChanged={handlePageChange}
        />
      </div>
    </div>
  );
}
