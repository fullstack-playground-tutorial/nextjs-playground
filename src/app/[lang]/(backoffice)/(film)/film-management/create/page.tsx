import { getFilmInterestService } from "@/app/core/server/context";
import FilmForm from "../components/FilmForm";
import { redirect } from "next/navigation";
import { getUser } from "@/app/dal";
import { CACHE_TAG } from "@/app/utils/cache/tag";

export default async function CreateFilmPage(
    props: {
        searchParams?: Promise<{ interest_q?: string }>
    }
) {
    const user = await getUser();
    if (!user) {
        redirect("/");
    }
    const searchParams = await props.searchParams;

    const list = searchParams?.interest_q
        ? await getFilmInterestService()
            .search({ keyword: searchParams.interest_q }, { tags: [CACHE_TAG.INTEREST_SUGGESTIONS] })
            .then((res) => res.list)
        : undefined;
    console.log("list with ", searchParams?.interest_q, list);

    return <FilmForm suggestions={list} />;
}
