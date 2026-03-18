import { CSSProperties } from "react";
import "./glossy-layer.css";

type GlossyLayerProps = {
    opacity?: number;
};

export default function GlossyLayer({ opacity = 0.35 }: GlossyLayerProps) {
    const style: CSSProperties = {
        background: `
      radial-gradient(
        circle at var(--x) var(--y),
        rgba(255,255,255,0.6),
        transparent 40%
      ),
        linear-gradient(
            120deg,
            transparent 40%,
            rgba(255, 255, 255, 0.4),
            transparent 60%
        )
    `,
        mixBlendMode: "screen",
        opacity,
        filter: "brightness(1.15) blur(0.5px)",
        animation: "glossySweep 4s linear infinite",
        backgroundSize: "250% 250%",
        borderRadius: "inherit"
    };

    return (
        <div
            className="absolute inset-0 pointer-events-none"
            style={style}
        />
    );
}