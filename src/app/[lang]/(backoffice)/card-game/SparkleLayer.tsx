import { useEffect, useRef } from "react";
import "./sparkle-layer.css";

type Sparkle = {
    x: number;
    y: number;
    size: number;
    delay: number;
};

export default function SparkleLayer() {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const sparkles: Sparkle[] = Array.from({ length: 30 }).map(() => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 6 + 2,
            delay: Math.random() * 3,
        }));

        sparkles.forEach((s) => {
            const el = document.createElement("span");

            el.style.position = "absolute";
            el.style.left = `${s.x}%`;
            el.style.top = `${s.y}%`;
            el.style.width = `${s.size}px`;
            el.style.height = `${s.size}px`;
            el.style.borderRadius = "50%";
            el.style.background = "white";
            el.style.opacity = "0";
            el.style.pointerEvents = "none";
            el.style.animation = `sparkle 2s ease-in-out ${s.delay}s infinite`;

            container.appendChild(el);
        });
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 pointer-events-none overflow-hidden"
        />
    );
}