"use server";

export default async function Page(props: {
  searchParams?: Promise<{
    list?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  if (!searchParams?.list) {
    return <div>Playlist not found</div>;
  }

  return <div>Playlist {searchParams.list}</div>;
}
