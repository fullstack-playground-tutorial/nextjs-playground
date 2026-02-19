import type { CSSProperties } from "react";

export type Cue = {
  start: number;
  end: number;
  text: string;
};

export type Font = {
  label: string;
  fontFamily: string;
  isSmallCaps?: boolean;
  
}

export type CaptionSettings = {
  fontSize: number; // vw
  lineHeight: number;
  color: string;
  bgColor: string;
  bgShadow: true;
  bgOpacity: number; // value from 0 -> 1
  textAlign: "center" | "left" | "right" | "justify";
  maxWidth: number; // percent
  bottom: number; // percent offset from bottom
  font: Font;
};

interface Props {
  subtitleText?: string,
  isCaptionOn: boolean,
  overlayStyle: CSSProperties,
}

export default function Caption({subtitleText, isCaptionOn, overlayStyle}: Props) {
  return (
    <div
      className={`${isCaptionOn && subtitleText? "": "hidden"}`}
      style={overlayStyle}>
      {subtitleText}
    </div>
  )
}
