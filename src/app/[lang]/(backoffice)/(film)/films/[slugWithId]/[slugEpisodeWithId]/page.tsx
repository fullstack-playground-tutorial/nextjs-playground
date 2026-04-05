import { getEpisodeService, getFilmService } from "@/app/core/server/context";
import { Breadcrumb } from "../../components/Breadcrumb";
import WrapperItem from "../../components/WrapperItem";
import { CACHE_TAG } from "@/app/utils/cache/tag";
import { notFound } from "next/navigation";
import VideoPlayer from "@/app/[lang]/(backoffice)/components/VideoPlayer";

export default async function Page(props: {
    params: Promise<{ slugWithId: string; slugEpisodeWithId: string; lang: string }>;
}) {
    const { slugWithId, slugEpisodeWithId } = await props.params;
    const id = slugWithId.slice(-36);
    const episodeId = slugEpisodeWithId.slice(-36);

    const episode = await getEpisodeService().load(episodeId, id, {
        tags: [CACHE_TAG.EPISODE + "-" + episodeId]
    });
    const film = await getFilmService().load(id, {
        tags: [CACHE_TAG.FILM + "-" + id]
    });
    if (!film || !episode) {
        notFound();
    }
    return (
        <div className="w-full">
            <div className="p-1 font-semibold text-shadow-2xs mb-4 dark:text-accent-0">
                <Breadcrumb
                    ItemAppearance={WrapperItem}
                    items={[
                        {
                            label: "Home",
                            href: "/",
                        },
                        {
                            label: "Films",
                            href: "/films",
                        },
                        {
                            label: film.title,
                            href: `/films/${slugWithId}`,
                        },
                        {
                            label: episode.title,
                            href: `/films/${slugWithId}/${slugEpisodeWithId}`,
                        },
                    ]}
                    className="px-2 py-1"
                />
            </div>

            <div className="pb-12">
                <div className="flex-1 lg:pt-14">
                    {episode.videoUrl && (
                        <VideoPlayer
                            source={{
                                id: episodeId,
                                title: episode.title || "",
                                sourceType: "youtube",
                                sourceURL: episode.videoUrl,
                            }}
                            thumbnailUrl={episode.thumbnailUrl || ""}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}