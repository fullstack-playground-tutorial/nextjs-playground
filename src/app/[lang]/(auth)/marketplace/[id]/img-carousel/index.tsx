"use client";
import { MouseEvent } from "react";
import { ImageInfo } from "../page";

interface Props {
  targetId?: string;
  imageList: ImageInfo[];
  onItemClick: (id: string) => void;
  onItemMouseEnter: (id: string) => void;
  ontItemMouseLeave: (id: string) => void;
}
export const ImageCarousel = (props: Props) => {
  const renderImageItems = () => {
    const handleMouseEnter = (e: MouseEvent, id: string) => {
      e.preventDefault();
      props.onItemMouseEnter(id);
    };
    const handleMouseLeave = (e: MouseEvent, id: string) => {
      e.preventDefault();
      props.ontItemMouseLeave(id);
    };
    const handleClick = (e: MouseEvent, id: string) => {
      props.onItemClick(id);
    };
    return (
      <div className="h-full w-full gap-2 items-center flex flex-row">
        {props.imageList.map((image) => (
          <img
            key={image.id}
            className={`size-20 rounded-md shadow-sm  ${
              props.targetId === image.id
                ? `ring-blue-500 ring-6 inset-0`
                : ""
            }`}
            onMouseEnter={(e) => handleMouseEnter(e, image.id)}
            onMouseLeave={(e) => handleMouseLeave(e, image.id)}
            onClick={(e) => handleClick(e, image.id)}
            src={image.src}
            alt={image.alt}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="h-full w-full p-2  group relative overflow-hidden">
        <div className="h-full w-full gap-2 items-center flex flex-row">
          {renderImageItems()}
        </div>
        <span className=" left-0 top-0 bottom-0 w-12 absolute transition group-hover:bg-white/5 flex items-center justify-end">
          <button className="rounded-full size-8 bg-white/25 group-hover:bg-white shadow transition ease-in-out cursor-pointer group-hover:-translate-x-2"></button>
        </span>
        <span className=" right-0 top-0 bottom-0 w-12 absolute transition group-hover:bg-white/5 flex items-center justify-start">
          <button className="rounded-full size-8 bg-white/25 group-hover:bg-white shadow transition ease-in-out cursor-pointer group-hover:translate-x-2"></button>
        </span>
      </div>
    </>
  );
};
