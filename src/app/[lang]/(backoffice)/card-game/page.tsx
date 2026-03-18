"use client";

import Card from "./Card";

export default function CardGamePage() {
    return (
        <div className="flex gap-4 flex-wrap">
            <Card effectLayers={["holo"]} backImage="https://upload.wikimedia.org/wikipedia/en/2/2b/Yugioh_Card_Back.jpg" frontImage="https://i.ebayimg.com/images/g/Iv0AAeSwVE9polRf/s-l1600.webp" />
            <Card effectLayers={["foil"]} backImage="https://upload.wikimedia.org/wikipedia/en/2/2b/Yugioh_Card_Back.jpg" frontImage="https://images.ygoprodeck.com/images/articles/12-25/LOCR-LP010.png" />
            <Card effectLayers={["sparkle"]} backImage="https://upload.wikimedia.org/wikipedia/en/2/2b/Yugioh_Card_Back.jpg" frontImage="https://i.ebayimg.com/images/g/Iv0AAeSwVE9polRf/s-l1600.webp" />
            <Card effectLayers={["prismatic"]} backImage="https://upload.wikimedia.org/wikipedia/en/2/2b/Yugioh_Card_Back.jpg" frontImage="https://i.ebayimg.com/images/g/Iv0AAeSwVE9polRf/s-l1600.webp" />
            <Card effectLayers={["fog"]} backImage="https://upload.wikimedia.org/wikipedia/en/2/2b/Yugioh_Card_Back.jpg" frontImage="https://i.ebayimg.com/images/g/Iv0AAeSwVE9polRf/s-l1600.webp" />
            <Card effectLayers={["glossy"]} backImage="https://upload.wikimedia.org/wikipedia/en/2/2b/Yugioh_Card_Back.jpg" frontImage="https://i.ebayimg.com/images/g/Iv0AAeSwVE9polRf/s-l1600.webp" />
        </div>
    );
}