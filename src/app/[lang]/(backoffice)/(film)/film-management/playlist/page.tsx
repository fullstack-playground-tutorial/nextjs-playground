import { getEpisodeService, getFilmService } from "@/app/core/server/context";
import PlaylistClient from "./PlaylistClient";

export default async function Page(props: {
  searchParams?: Promise<{
    list?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  if (!searchParams?.list) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-0 text-primary">
        Playlist not found
      </div>
    );
  }

  const film = await getFilmService().load(searchParams.list);
  if (!film) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-0 text-primary">
        Playlist not found
      </div>
    );
  }

  const episode = await getEpisodeService().getCollection(searchParams.list);

  return <PlaylistClient playlistName={film.title} episodes={episode} />;
}
