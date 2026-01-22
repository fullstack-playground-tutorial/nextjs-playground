// file src/app/[lang]/(backoffice)/topics/tags/page.tsx
import { hasPermission } from "@/app/dal";
import { redirect } from "next/navigation";
import { getFilmInterestService, getTopicTagService } from "@/app/core/server/context";
import InterestsManagement from "./components/Interests";
import { CACHE_TAG } from "@/app/utils/cache/tag";

export default async function Page(props: {
    searchParams?: Promise<{
        q?: string;
        page?: string;
        sort?: string;
        limit?: string;
        showModal?: boolean;
        id?: string;
        action?: "create" | "edit" | "delete";
    }>;
}) {
    const accepted = await hasPermission(["film.read"]);
    if (!accepted) {
        redirect("/");
    }

    const searchParams = await props.searchParams;

    const q = searchParams?.q || "";
    const currentPage = Number(searchParams?.page) || 1;
    const limit = Number(searchParams?.limit) || 25;
    const sort = searchParams?.sort || "created_at";

    const data = await getFilmInterestService()
        .search(
            {
                keyword: q,
                sort: sort,
                offset: (currentPage - 1) * limit,
                limit: limit,
            },
            { revalidate: 3600, tags: [CACHE_TAG.FILM_INTERESTS] }
        )
        .catch((e) => {
            console.log("e", e);
            throw e;
        });

    return (
        <>
            <InterestsManagement
                hasPermission={accepted}
                data={data}
                limit={limit}
                sort={sort}
                currentPage={currentPage}
            />
        </>
    );
}
