export function PrismEdge() {
    return (
        <div
            className="absolute inset-0 pointer-events-none"
            style={{
                background: `
          linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)
        `,
                mixBlendMode: "screen",
                opacity: 0.6,
            }}
        />
    );
}