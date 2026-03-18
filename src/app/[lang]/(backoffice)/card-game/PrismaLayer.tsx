import PrismaTextureLayer from "./PrismaTextureLayer";
import PrismaFoilLayer from "./PrismaFoildLayer";
import "./prisma-layer.css";
import { PrismEdge } from "./PrismEdge";
export default function PrismaLayer() {
    return (
        <>
            <PrismaFoilLayer />
            <PrismaTextureLayer />
            <PrismEdge />
        </>
    );
}