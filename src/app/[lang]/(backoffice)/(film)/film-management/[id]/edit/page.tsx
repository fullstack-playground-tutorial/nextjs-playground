import { getFilmInterestService, getFilmService } from "@/app/core/server/context";
import FilmForm from "../../components/FilmForm";
import { notFound, redirect } from "next/navigation";
import { getUser } from "@/app/dal";
import { CACHE_TAG } from "@/app/utils/cache/tag";

export default async function EditFilmPage(
    props: {
        params: Promise<{ id: string; lang: string }>;
        searchParams?: Promise<{ interest_q?: string }>;
    }
) {
    const user = await getUser();
    if (!user) {
        redirect("/");
    }

    const { id } = await props.params;
    const searchParams = await props.searchParams;

    const film = await getFilmService().load(id);

    if (!film) {
        notFound();
    }

    const suggestions = searchParams?.interest_q
        ? await getFilmInterestService()
            .search({ keyword: searchParams.interest_q }, { tags: [CACHE_TAG.INTEREST_SUGGESTIONS] })
            .then((res) => res.list)
        : undefined;

    return (
        <div className="w-full">
            <FilmForm film={film} suggestions={suggestions} />
        </div>
    );
}
