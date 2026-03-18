import { CSSProperties } from "react";

type HologramLayerProps = {
    opacity?: number;
};

export default function HologramLayer({
    opacity = 0.4,
}: HologramLayerProps) {
    const style: CSSProperties = {
        background: `
      radial-gradient(circle at var(--x) var(--y), rgba(255,255,255,0.8), transparent 40%),
      linear-gradient(120deg, red, orange, yellow, green, cyan, blue, violet)
    `,
        mixBlendMode: "color-dodge",
        opacity,
    };

    return (
        <div
            className="absolute inset-0 pointer-events-none"
            style={style}
        />
    );
}