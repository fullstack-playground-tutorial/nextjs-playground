"use client";

import { Story } from "@/app/feature/story";
import StoryDetailComponent from "./StoryDetail";
import { useDate } from "@/app/hooks/useDate";
import { InternalizationContext } from "@/app/core/client/context/internalization/context";
import { use } from "react";

interface Props {
  story: Story;
}
export * from "./StoryPost";

export const StoryComponent = (props: Props) => {
  const internalization = use(InternalizationContext);
  if (!internalization) {
    return <></>;
  }
  const { timeSince } = useDate(internalization.localize);
  return (
    <div className="min-w-[400px] relative max-h-[400px] w-1/2 mx-auto bg-glass-100 rounded-lg p-4 shadow-lg border border-l-glass-500 backdrop-blur-md border-t-glass-500 border-r-glass-200 border-b-glass-200">
      <div className="inline-flex flex-row gap-2 min-w-[200px] bg-glass-200 rounded-full p-2 border shadow-md border-t-glass-500 border-r-glass-200 border-b-glass-200">
        <div className="flex shadow-md items-center justify-center h-12 w-12 rounded-full bg-glass-200 border border-t-glass-500 border-l-glass-500 border-r-glass-200 border-b-glass-200">
          <img
            className="h-full w-full rounded-full border-2 border-white"
            src="https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
            alt=""
            srcSet="https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
          />
        </div>
        <div className="flex flex-col tracking-wide text-black text-sm my-auto">
          <span className="font-bold">{props.story?.author?.username}</span>
          <span>{timeSince(props.story?.createdAt ?? new Date())}</span>
        </div>
      </div>
      <StoryDetailComponent content="" />
      <div className="flex flex-row m-0 mt-4 gap-3 tracking-wide">
        <div className="flex justify-center items-center border rounded-full h-8 min-w-8 align-center px-4 py-2 font-normal text-black shadow-md bg-glass-200 border-l-glass-500 border-t-glass-500 border-r-glass-200 border-b-glass-200">
          <label>Like</label>
        </div>
        <div className="flex justify-center items-center border rounded-full h-8 min-w-8 align-center px-4 py-2 font-normal text-black shadow-md bg-glass-200 border-l-glass-500 border-t-glass-500 border-r-glass-200 border-b-glass-200">
          <label>Share</label>
        </div>
        <div className="flex justify-center items-center border rounded-full h-8 min-w-8 align-center px-4 py-2 font-normal text-black shadow-md bg-glass-200 border-l-glass-500 border-t-glass-500 border-r-glass-200 border-b-glass-200">
          <label>Comment</label>
        </div>
      </div>
      <div className="flex flex-col rounded-md border tracking-wide text-sm  mt-4 p-4 gap-4 bg-glass-200  border-t-glass-500 border-l-glass-500 border-r-glass-200 border-b-glass-200">
        <div className="flex flex-row gap-2">
          <div className="flex flex-row gap-1 items-center">
            <div className="w-6 h-6 rounded-full  bg-yellow-300 shadow-md"></div>
            <span className="">100</span>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <div className="w-6 h-6 rounded-full  bg-blue-300 shadow-md"></div>
            <span>100</span>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <div className="w-6 h-6 rounded-full  bg-green-300 shadow-md"></div>
            <span>100</span>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          {/* <Comment comment={undefined}/> */}
        </div>
      </div>
    </div>
  );
};
