"use client";

import { SearchBar } from "@/components/Search";
import { useState } from "react";
import Link from 'next/link';
import GridIcon from "../../components/Sidebar/icons/grid_menu.svg";
import ListIcon from "../../components/Sidebar/icons/menu.svg";
import FilmIcon from "../../components/Sidebar/icons/film.svg"; // Mock poster

// Mock Data
type Film = {
    id: string;
    title: string;
    releaseDate: string;
    status: "Published" | "Draft" | "Archived";
    director: string;
    tags: string[];
};

const MOCK_FILMS: Film[] = [
    {
        id: "1",
        title: "Inception",
        releaseDate: "2010-07-16",
        status: "Published",
        director: "Christopher Nolan",
        tags: ["Sci-Fi", "Thriller", "Dream"],
    },
    {
        id: "2",
        title: "Interstellar",
        releaseDate: "2014-11-07",
        status: "Published",
        director: "Christopher Nolan",
        tags: ["Sci-Fi", "Space", "Drama"],
    },
    {
        id: "3",
        title: "Dune: Part Two",
        releaseDate: "2024-03-01",
        status: "Draft",
        director: "Denis Villeneuve",
        tags: ["Sci-Fi", "Adventure", "Epic"],
    },
    {
        id: "4",
        title: "Oppenheimer",
        releaseDate: "2023-07-21",
        status: "Archived",
        director: "Christopher Nolan",
        tags: ["Biography", "Drama", "History"],
    },
    {
        id: "5",
        title: "The Matrix",
        releaseDate: "1999-03-31",
        status: "Published",
        director: "Lana Wachowski",
        tags: ["Action", "Sci-Fi"],
    },
];

export default function FilmManagementPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");

    const filteredFilms = MOCK_FILMS.filter((film) =>
        film.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const StatusBadge = ({ status }: { status: Film["status"] }) => (
        <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
      ${status === "Published"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : ""
                }
      ${status === "Draft"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : ""
                }
      ${status === "Archived"
                    ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    : ""
                }
    `}
        >
            {status}
        </span>
    );

    return (
        <div className="p-6 min-h-screen dark:text-primary flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-row justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold dark:text-accent-0 text-shadow-lg">
                        Film Management
                    </h1>
                    <p className="text-sm dark:text-secondary mt-1">
                        Manage your film catalog
                    </p>
                </div>
                <Link href="film-management/create">
                    <button className="bg-accent-0 hover:bg-accent-1 text-white font-semibold py-2 px-4 rounded shadow transition-colors">
                        + Create New
                    </button>
                </Link>
            </div>

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
                                                {film.releaseDate}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={film.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-wrap gap-1">
                                                {film.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="text-xs bg-gray-100 dark:bg-surface-2 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300"
                                                    >
                                                        {tag}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredFilms.map((film) => (
                            <div
                                key={film.id}
                                className="bg-white dark:bg-surface-0 border dark:border-border rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
                            >
                                <div className="h-40 bg-gray-200 dark:bg-surface-1 flex items-center justify-center">
                                    <FilmIcon className="size-16 fill-gray-400 dark:fill-secondary" />
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg leading-tight dark:text-primary">
                                            {film.title}
                                        </h3>
                                        <StatusBadge status={film.status} />
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-secondary mb-3">
                                        Dir. {film.director}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1 mb-4 mt-auto">
                                        {film.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-xs bg-gray-100 dark:bg-surface-2 px-2 py-1 rounded text-gray-600 dark:text-gray-300"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="border-t dark:border-border pt-3 mt-2 flex justify-between items-center text-sm">
                                        <span className="text-gray-500 dark:text-secondary">
                                            {film.releaseDate}
                                        </span>
                                        <div className="space-x-3">
                                            <button className="text-accent-0 hover:underline">
                                                Edit
                                            </button>
                                            <button className="text-red-500 hover:underline">
                                                Delete
                                            </button>
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
                    Showing {filteredFilms.length} of {MOCK_FILMS.length} entries
                </span>
                <div className="flex gap-1">
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
                </div>
            </div>
        </div>
    );
}