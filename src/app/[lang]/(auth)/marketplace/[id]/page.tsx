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
import { Modal } from "@/app/components/Modal";

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
  zoomPosition: ZoomPosition;
  scale: number;
  images: ImageInfo[];
  targetImg?: ImageInfo;
  targetImgSize: TargetImageSize;
  hoverImg?: ImageInfo;

  quantity: number;
}
const initialState: InternalState = {
  targetImgSize: { width: 0, height: 0 },
  zoomPosition: { x: 0, y: 0 },
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
  quantity: 1,
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
      zoomPosition: {
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
    <div className="flex flex-col w-300 h-screen items-center mx-auto">
      <span className="self-start">breadcrumb</span>
      <div className="flex flex-row h-164 w-full gap-1">
        <div className="flex flex-col rounded-t-md w-full basis-2/3 gap-1 overflow-hidden ">
          <div
            className={`basis-5/6 overflow-hidden flex justify-center w-full bg-layer-2 transition shadow-sm ${
              state.scale == 1 ? `cursor-zoom-in` : `cursor-zoom-out`
            }`}
            onClick={(e) => handleZoomToggle(e)}
            onMouseMove={(e) => handleMouseMove(e)}

            ref={containerRef as any}
          >
            {(state.hoverImg || state.targetImg) && (
              <img
                className={`h-full object-cover`}
                style={{
                  scale: `${state.scale * 100}%`,
                  transformOrigin: `${state.zoomPosition.x * 100}% ${
                    state.zoomPosition.y * 100
                  }%`,
                }}
                src={state.hoverImg ? state.hoverImg.src : state.targetImg?.src}
                alt={state.hoverImg ? state.hoverImg.alt : state.targetImg?.alt}
                ref={imgRef as any}
              />
            )}
          </div>

          <div className="basis-1/6 rounded-b-md h-full w-full overflow-hidden bg-layer-2 shadow-sm">
            <ImageCarousel
              targetId={state.targetImg?.id}
              imageList={state.images}
              onItemClick={onItemClick}
              onItemMouseEnter={onItemMouseEnter}
              ontItemMouseLeave={onItemMouseLeave}
            />
          </div>
          {/* <span className="text-2xl mb-2 text-center font-semibold">
            Pokemon Booster Box
          </span> */}
        </div>
        <div className="basis-1/3 flex flex-col bg-layer-2 shadow-sm p-2 rounded-md justify-between">
          <div className="p-2 bg-layer-3 flex flex-col items-center rounded-md">
            <img
              src="https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
              alt=""
              className="size-12 rounded-full shadow-sm mx-auto"
            />
            <span className="text-sm font-semibold">Shopper</span>
            <div className="flex flex-row gap-4">
              <a className="text-sm font-light underline cursor-pointer">positive</a>
              <a className="text-sm font-light underline cursor-pointer">see other</a>
              <a className="text-sm font-light underline cursor-pointer">contact</a>
            </div>
          </div>
          <div className="basis-1/3">
          <section className="flex flex-row text-sm">
            <span>Shop Voucher</span>
            <span></span>
          </section>
          <section className="flex flex-row text-sm">
            <span>Shipping</span>
            <span></span>
          </section>
          </div>
          
          <div className="p-2 flex flex-col gap-2">
            <div className="mt-4 flex flex-col items-center">
              <span className="text-xl font-medium">₫ 700.000</span>
            </div>
            <div className="flex flex-row mx-auto">
              <button className="border flex shadow-sm w-8 h-8 justify-center items-center text-sm">
                +
              </button>
              <span className="flex border-y shadow-sm w-12 h-8 justify-center items-center text-sm">
                {state.quantity}
              </span>
              <button className="border flex shadow-sm w-8 h-8 justify-center items-center text-sm">
                -
              </button>
            </div>
            <button className="btn btn-md btn-outline-primary">
              Add To Cart
            </button>
            <button className="btn btn-md btn-primary">Buy now</button>
          </div>
        </div>
      </div>

      <Modal
        isVisible={false}
        backdropColor="bg-layer-1"
        contentColor="bg-transparent"
      >
        <div className="flex flex-col gap-2 m-4 overflow-auto justify-between h-180">
          <div className="basis-3/4 w-full flex items-center justify-center max-h-full">
            <img
              src={state.targetImg?.src}
              className="object-cover w-auto max-h-140"
              alt=""
            />
          </div>
          <div className="basis-1/4 rounded-md overflow-hidden w-full min-w-160">
            <ImageCarousel
              targetId={state.targetImg?.id}
              imageList={state.images}
              onItemClick={onItemClick}
              onItemMouseEnter={onItemMouseEnter}
              ontItemMouseLeave={onItemMouseLeave}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
