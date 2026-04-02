import Navbar from "./components/Navbar";
import FilmIconRaw from "../../components/Sidebar/icons/film.svg";
import { getFilmInterestService } from "@/app/core/server/context";
export default async function Layout({ children }: { children: React.ReactNode }) {
    const FilmIcon = FilmIconRaw as React.FC<React.SVGProps<SVGSVGElement>>;
    const interests = await getFilmInterestService().search({ limit: 100 });

    return (
        <div className="p-4 dark:bg-surface-0 min-h-screen dark:text-primary max-w-300 mx-auto flex flex-col">
            <div className="flex flex-row items-center">
                {/* Topbar */}
                <div className="flex flex-row justify-start items-center gap-2 w-full">
                    <FilmIcon className="mt-2 size-20 fill-accent-0" />

                    <h1 className="font-semibold underline underline-offset-10 dark:text-accent-0 text-5xl text-shadow-lg/50">
                        CINEMATIC
                    </h1>
                </div>
            </div>

            <Navbar interests={interests} />

            {children}
        </div>
    );
}