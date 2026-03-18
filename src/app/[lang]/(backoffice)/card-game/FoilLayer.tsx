export default function FoilLayer() {
    return (
        <div
            className="absolute inset-0 pointer-events-none"
            style={{
                backgroundImage: `
          repeating-linear-gradient(
            45deg,
            rgba(255,255,255,0.1) 0px,
            rgba(255,255,255,0.1) 2px,
            transparent 2px,
            transparent 6px
          )
        `,
                mixBlendMode: "overlay",
            }}
        />
    );
}