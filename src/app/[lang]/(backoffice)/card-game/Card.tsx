import { useRef, useState } from "react";
import HologramLayer from "./HoloLayer";
import FoilLayer from "./FoilLayer";
import SparkleLayer from "./SparkleLayer";
import PrismaLayer from "./PrismaLayer";
import FogLayer from "./FogLayer";
import GlossyLayer from "./GlossyLayer";

type EffectLayer = "holo" | "foil" | "sparkle" | "prismatic" | "fog" | "glossy";

type HoloCardProps = {
    frontImage: string;
    backImage: string;
    className?: string;
    effectLayers: EffectLayer[];
};

export default function Card({
    frontImage,
    backImage,
    className,
    effectLayers,
}: HoloCardProps) {
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || isFlipped) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateX = -(y / rect.height - 0.5) * 20;
        const rotateY = (x / rect.width - 0.5) * 20;

        cardRef.current.style.setProperty("--x", `${x}px`);
        cardRef.current.style.setProperty("--y", `${y}px`);

        setTilt({ x: rotateX, y: rotateY });
    };

    const handleLeave = () => {
        if (isFlipped) return;
        setTilt({ x: 0, y: 0 });
    };

    const handleFlip = () => {
        setIsFlipped((prev) => !prev);
    };

    return (
        <div
            className={`perspective-[1000px] ${className || ""}`}
            onClick={handleFlip}
        >
            <div
                ref={cardRef}
                onMouseMove={handleMove}
                onMouseLeave={handleLeave}
                className={`
          relative w-[300px] h-[440px]
          transition-transform duration-500
          rounded-lg
          [transform-style:preserve-3d]
        `}
                style={{
                    transform: isFlipped
                        ? `rotateY(180deg)`
                        : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,

                    "--x": "50%",
                    "--y": "50%",
                } as React.CSSProperties}
            >
                {/* FRONT (có hologram) */}
                <div
                    className="absolute inset-0 overflow-hidden [backface-visibility:hidden]"
                    style={{
                        backgroundImage: `url(${frontImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    {effectLayers.includes("holo") && <HologramLayer />}
                    {effectLayers.includes("foil") && <FoilLayer />}
                    {effectLayers.includes("prismatic") && <PrismaLayer />}
                    {effectLayers.includes("fog") && <FogLayer />}
                    {effectLayers.includes("sparkle") && <SparkleLayer />}
                    {effectLayers.includes("glossy") && <GlossyLayer />}

                </div>

                {/* BACK (no effect) */}
                <div
                    className="absolute inset-0 overflow-hidden
                     [backface-visibility:hidden]
                     rotate-y-180"
                    style={{
                        backgroundImage: `url(${backImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        transform: "rotateY(180deg)",
                    }}
                />
            </div>
        </div>
    );
}