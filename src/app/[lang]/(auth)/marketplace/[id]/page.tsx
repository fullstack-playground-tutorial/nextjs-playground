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
      isZoom: false,
    }));
  };

  const onItemMouseLeave = (id: string) => {
    setState((prev) => ({ ...prev, hoverImg: undefined }));
  };

  // const handleZoomToggle = (e: MouseEvent) => {
  //   e.preventDefault();
  //   if (state.scale == 1) {
  //     zoomImage(e.clientX, e.clientY, 1);
  //     return;
  //   }
  //   setState((prev) => ({ ...prev, scale: 1 }));
  // };

  // const zoomImage = (clientX: number, clientY: number, direction: number) => {
  //   const container = containerRef.current;
  //   if (!container) return;

  //   const { width, height, left, top } = container.getBoundingClientRect();
  //   const offsetX = (clientX - left) / width;
  //   const offsetY = (clientY - top) / height;

  //   const newScale = Math.min(Math.max(state.scale + direction * 0.5, 1), 3);
  //   if (newScale === state.scale) return;

  //   // Điều chỉnh vị trí khi zoom để trỏ chuột luôn ở đúng điểm zoom
  //   const deltaX = (offsetX - 0.5) * (newScale - state.scale) * width;
  //   const deltaY = (offsetY - 0.5) * (newScale - state.scale) * height;

  //   const maxOffsetX = (width * (newScale - 1)) / 2;
  //   const maxOffsetY = (height * (newScale - 1)) / 2;

  //   const newX = Math.min(
  //     Math.max(state.zoomPositon.x - deltaX, -maxOffsetX),
  //     maxOffsetX
  //   );
  //   const newY = Math.min(
  //     Math.max(state.zoomPositon.y - deltaY, -maxOffsetY),
  //     maxOffsetY
  //   );

  //   setState((prevState) => ({
  //     ...prevState,
  //     scale: newScale,
  //     zoomPositon: {
  //       x: newX,
  //       y: newY,
  //     },
  //   }));
  // };

  const handleMouseMove = (e: MouseEvent) => {
    if (state.scale == 1) return;
    const container = containerRef.current;
    const img = imgRef.current;
    if (!(container && img)) return;

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
    const originX = (mouseX / container.offsetWidth) * 100;
    const originY = (mouseY / container.offsetHeight) * 100;

    img.style.transformOrigin = `${originX}% ${originY}%`;
    setState((prev) => ({
      ...prev,
      zoomPositon: {
        x: originX,
        y: originY,
      },
    }));
  };

  return (
    <div className="flex flex-col w-full">
      <div>breadcrumb</div>
      <div className="flex flex-row gap-4">
        <div className=" flex flex-col rounded-2xl w-full items-center basis-3/4 gap-3">
          <div
            className={`container flex justify-center w-full h-128 rounded-2xl shadow-sm bg-color-app-2 overflow-hidden transition ${
              state.scale == 1
                ? `cursor-zoom-in`
                : `cursor-zoom-out scale-${state.scale * 100} translateX-[${
                    state.zoomPositon.x
                  }px] translateY-[${state.zoomPositon.y}px]`
            }`}
            ref={containerRef as any}
            onMouseMove={(e) => handleMouseMove(e)}
          >
            {(state.hoverImg || state.targetImg) && (
              <img
                className={`h-full origin-center object-cover hover:scale-200`}
                src={state.hoverImg ? state.hoverImg.src : state.targetImg?.src}
                alt={state.hoverImg ? state.hoverImg.alt : state.targetImg?.alt}
                ref={imgRef as any}
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
