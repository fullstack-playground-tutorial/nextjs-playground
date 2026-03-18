import { CSSProperties } from "react";
import "./fog-layer.css";

type FogLayerProps = {
    opacity?: number;
};

export default function FogLayer({ opacity = 0.25 }: FogLayerProps) {
    const style: CSSProperties = {
        background: `
    
      radial-gradient(circle at 30% 40%, rgba(200, 220, 255, 0.25), transparent 60%),
      radial-gradient(circle at 70% 60%, rgba(200, 220, 255, 0.2), transparent 60%),
      radial-gradient(circle at 50% 80%, rgba(200, 220, 255, 0.15), transparent 70%)
    `,
        backgroundSize: "200% 200%",
        mixBlendMode: "screen",
        opacity,
        animation: "fogMove 12s ease-in-out infinite alternate",
        filter: "blur(20px)",
    };

    return (
        <div
            className="absolute inset-0 pointer-events-none"
            style={style}
        />
    );
}