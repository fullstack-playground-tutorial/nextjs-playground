import { search } from "@/app/feature/story/actions";
import { StoryComponent, StoryPost } from "./components/Story";
import { Suspense } from "react";
import StoryLoading from "./components/Story/Loading";

export default async function HomePage() {
  const stories = await search({});
  return (
    <div className="mx-auto flex flex-col gap-4">
      <StoryPost />
      {stories &&
        stories.map((item) => (
          <div key={item.id}>
            <Suspense fallback={<StoryLoading />}>
              <StoryComponent story={item} />
            </Suspense>
          </div>
        ))}
    </div>
  );
}
