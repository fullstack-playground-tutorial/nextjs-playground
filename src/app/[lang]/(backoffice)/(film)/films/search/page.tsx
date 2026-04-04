import { getFilmInterestService, getFilmService } from "@/app/core/server/context";
import SearchTool from "./components/SearchTool";
import FilmList from "./components/FilmList";

type Props = {
    searchParams: Promise<{
        q?: string;
        page?: string;
        sort?: string;
        limit?: string;
        interests?: string;
        fromYear?: string;
        toYear?: string;
    }>;
};

export default async function Page(props: Props) {
    const searchParams = await props.searchParams;
    const { list } = await getFilmInterestService().search({ limit: 100 });
    const q = searchParams?.q || "";
    const currentPage = Number(searchParams?.page) || 1;
    const limit = Number(searchParams?.limit) || 25;
    const sort = searchParams?.sort || "created_at";
    const offset = (currentPage - 1) * limit;
    const searchResult = await getFilmService().search({
        keyword: q,
        sort: sort,
        limit: limit,
        offset: offset,
        interestIds: searchParams.interests?.split(","),
        fromYear: Number(searchParams.fromYear),
        toYear: Number(searchParams.toYear),
    });
    return (
        <div className="w-full flex flex-col gap-10">
            <div className="w-full max-w-7xl mx-auto px-4">
                <SearchTool interests={list} searchParams={searchParams} />
            </div>
            <div className="w-full max-w-7xl mx-auto px-4">
                <FilmList searchParams={searchParams} searchResult={searchResult} limit={limit} currentPage={currentPage} sort={sort} />
            </div>
        </div>
    );
}