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

  return <PlaylistClient playlistName={searchParams.list} />;
}
