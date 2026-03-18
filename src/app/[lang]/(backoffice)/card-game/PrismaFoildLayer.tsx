import { CSSProperties } from "react";

type Props = {
    opacity?: number;
};

export default function PrismaFoilLayer({ opacity = 0.6 }: Props) {
    const style: CSSProperties = {
        background: `
      radial-gradient(circle at var(--x) var(--y), rgba(255,255,255,1), transparent 25%),

      linear-gradient(45deg, rgba(255,0,120,0.8) 0%, transparent 40%),
      linear-gradient(135deg, rgba(0,255,255,0.8) 0%, transparent 40%),
      linear-gradient(225deg, rgba(255,255,0,0.7) 0%, transparent 40%),
      linear-gradient(315deg, rgba(0,128,255,0.7) 0%, transparent 40%)
    `,
        backgroundSize: "200% 200%",
        mixBlendMode: "color-dodge",
        opacity,

        // 👉 tăng độ “gắt” của ánh sáng
        filter: "contrast(1.6) saturate(1.8)",

        animation: "prismaShift 4s linear infinite",
    };

    return (
        <div className="absolute inset-0 pointer-events-none" style={style} />
    );
}