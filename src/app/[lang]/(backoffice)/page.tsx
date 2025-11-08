import { search } from "@/app/feature/story/actions";
import { StoryComponent } from "./components/Story";
import { Suspense } from "react";
import StoryLoading from "./components/Story/Loading";
import StoryPost from "./components/Story/StoryPost";

export default async function HomePage() {
  const stories = await search({});
  return (
    <div className="mx-auto flex flex-col gap-4">
      <Suspense
        fallback={
          <>
            <p>...</p>
          </>
        }
      >
        <StoryPost />
      </Suspense>
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
