"use server";
import Link from 'next/link';
import { Film } from "@/app/feature/film";

export default function FilmManagementPage(props: { searchParams: { [key: string]: string | string[] | undefined } }) {


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
        </div>
    );
}