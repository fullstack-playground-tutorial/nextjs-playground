"use client";

import {
  MouseEvent,
  Ref,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { ImageCarousel } from "./img-carousel";
import { start } from "repl";

export interface ImageInfo {
  id: string;
  src: string;
  alt: string;
}

interface ZoomPosition {
  x: number;
  y: number;
}

interface TargetImageSize {
  width: number;
  height: number;
}

interface Props {
  params: { language: string; id: string };
}

interface InternalState {
  zoomPositon: ZoomPosition;
  scale: number;
  images: ImageInfo[];
  targetImg?: ImageInfo;
  targetImgSize: TargetImageSize;
  hoverImg?: ImageInfo;
}
const initialState: InternalState = {
  targetImgSize: { width: 0, height: 0 },
  zoomPositon: { x: 0, y: 0 },
  scale: 1,
  images: [
    {
      id: "0001",
      src: "https://fastly.picsum.photos/id/237/200/200.jpg?hmac=zHUGikXUDyLCCmvyww1izLK3R3k8oRYBRiTizZEdyfI",
      alt: "",
    },
    {
      id: "0002",
      src: "https://i.ebayimg.com/images/g/ENIAAeSwc3tnzEuD/s-l960.webp",
      alt: "",
    },
  ],
};
export default function ProductDetailPage(props: Props) {
  const containerRef = useRef<HTMLDivElement>(undefined);
  const imgRef = useRef<HTMLImageElement>(undefined);
  const [state, setState] = useState<InternalState>({
    ...initialState,
    targetImg:
      initialState.images.length > 0 ? initialState.images[0] : undefined,
  });

  const onItemClick = (id: string) => {
    const idx = initialState.images.findIndex((item) => item.id === id);
    setState((prev) => ({
      ...prev,
      targetImg: idx >= 0 ? state.images[idx] : undefined,
    }));
  };

  const onItemMouseEnter = (id: string) => {
    const idx = initialState.images.findIndex((item) => item.id === id);
    setState((prev) => ({
      ...prev,
      hoverImg: idx >= 0 ? state.images[idx] : undefined,
      scale: 1,
    }));
  };

  const onItemMouseLeave = (id: string) => {
    setState((prev) => ({ ...prev, hoverImg: undefined }));
  };

  const handleZoomToggle = (e: MouseEvent) => {
    e.preventDefault();
    if (state.scale == 1) {
      zoomImage(e.clientX, e.clientY);
    } else {
      setState((prev) => ({ ...prev, scale: 1 }));
    }
  };

  const zoomImage = (clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return;

    const { width, height, left, top } = container.getBoundingClientRect();
    const offsetX = (clientX - left) / width;
    const offsetY = (clientY - top) / height;

    setState((prev) => ({
      ...prev,
      scale: 2,
      zoomPositon: {
        x: offsetX,
        y: offsetY,
      },
    }));
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (state.scale == 1) return;
    zoomImage(e.clientX, e.clientY);
  };

  return (
    <div className="flex flex-col w-full">
      <div>breadcrumb</div>
      <div className="flex flex-row gap-4">
        <div className=" flex flex-col rounded-2xl w-full items-center basis-3/4 gap-3">
          <div
            className={`container flex justify-center w-full h-128 rounded-2xl shadow-sm bg-color-app-2 overflow-hidden transition ${
              state.scale == 1 ? `cursor-zoom-in` : `cursor-zoom-out`
            }`}
            ref={containerRef as any}
          >
            {(state.hoverImg || state.targetImg) && (
              <img
                className={`h-full object-cover`}
                style={{
                  scale: `${state.scale * 100}%`,
                  transformOrigin: `${state.zoomPositon.x * 100}% ${
                    state.zoomPositon.y * 100
                  }%`,
                }}
                src={state.hoverImg ? state.hoverImg.src : state.targetImg?.src}
                alt={state.hoverImg ? state.hoverImg.alt : state.targetImg?.alt}
                ref={imgRef as any}
                onClick={(e) => handleZoomToggle(e)}
                onMouseMove={(e) => handleMouseMove(e)}
              />
            )}
          </div>

          <ImageCarousel
            targetId={state.targetImg?.id}
            imageList={state.images}
            onItemClick={onItemClick}
            onItemMouseEnter={onItemMouseEnter}
            ontItemMouseLeave={onItemMouseLeave}
          />
        </div>
        <div className="basis-1/3 bg-color-app-2 rounded-2xl shadow-sm"></div>
      </div>
    </div>
  );
}
