"use client";

import CustomSwitch from "@/app/components/ThemeToggle";
import StoryPost from "../../(home)/components/Story/StoryPost";
import { MouseEvent, useRef, useState } from "react";
import "./ImagePan.css";
type Position = { x: number; y: number };
export default function Page() {
  const [checked, setChecked] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [scale, setScale] = useState<number>(1);

  const containerRef = useRef<HTMLDivElement>(undefined);
  const imageRef = useRef<HTMLImageElement>(undefined);

  const handleToggle = () => {
    console.log("handleToggle");
    setChecked(!checked);
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!(containerRef.current && imageRef.current)) return;
    const container = containerRef.current;
    const image = imageRef.current;

    // Adjust this value to control the buffer area around the frame.
    const buffer = -10;

    const containerRect = container.getBoundingClientRect();

    const imageWidth = image.clientWidth ;
    const imageHeight = image.clientHeight ;

    // Position's mouse in container.
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;

    // Movement limit of image.
    const maxX = imageWidth - container.clientWidth;
    const maxY = imageHeight - container.clientHeight;
    console.log(maxX);
    
    // Convert mouse position in container to percent unit.
    const xPercentage =
      (mouseX - buffer) / (container.clientWidth - buffer * 2);
    const yPercentage =
      (mouseY - buffer) / (container.clientHeight - buffer * 2);

    // Offset between origin poistion with new position.
    const offsetX = Math.min(Math.max(0, xPercentage * maxX), maxX);
    const offsetY = Math.min(Math.max(0, yPercentage * maxY), maxY);

    setPosition({ x: offsetX, y: offsetY });
  };
  return (
    <div className="flex flex-col ">
      <StoryPost></StoryPost>
      <CustomSwitch onToggle={handleToggle} checked={checked}></CustomSwitch>
      <div
        ref={containerRef as any}
        className="zoom-container self-center"
        onMouseMove={(e) => handleMouseMove(e)}
      >
        <img
          onClick={(e) => {
            e.preventDefault();

            setScale(scale == 1 ? 2 : 1);
          }}
          className="zoom-image"
          style={{
            transform: `translate(-${position.x}px, -${position.y}px)`,
            scale: `${scale * 100}%`,
          }}
          src="https://picsum.photos/500/450"
          alt=""
          ref={imageRef as any}
        />
      </div>
    </div>
  );
}
