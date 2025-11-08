import { useMemo } from "react";

type Props = {
  width: string;
  height: string;
  borderRadius?: string;
};

export default function SkeletonElement({ width, height, borderRadius = "0px"}: Props) {
  const styleConf = useMemo<React.CSSProperties>(() => {
    return {
      backgroundColor: "rgba(0,0,0,0.2)",
      overflow: "hidden",
      width: width,
      borderRadius: borderRadius,
      height: height,
    };
  }, [width, height, borderRadius]);

  return <div className="animate-pulse" style={styleConf}></div>;
}
