import Image from "next/image";
import type { CSSProperties } from "react";
import { getTechVisual } from "@/components/tech-visuals";

const rasterAssetPattern = /\.(?:avif|jpe?g|png|webp)$/i;

export function TechIcon({ name }: { name: string }) {
  const visual = getTechVisual(name);

  if (!visual) {
    return null;
  }

  if (visual.kind === "logo") {
    return (
      <span
        aria-hidden="true"
        className="tech-icon"
        style={{ "--tech-color": `#${visual.icon.hex}` } as CSSProperties}
      >
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
          <path d={visual.icon.path} fill="currentColor" />
        </svg>
      </span>
    );
  }

  if (visual.kind === "asset") {
    const isRasterAsset = rasterAssetPattern.test(visual.src);
    const assetStyle =
      visual.displayWidth || visual.displayHeight
        ? ({
            width: visual.displayWidth,
            height: visual.displayHeight,
            flexBasis: visual.displayWidth
          } as CSSProperties)
        : undefined;

    return (
      <span aria-hidden="true" className="tech-icon tech-icon-asset" style={assetStyle}>
        <Image
          alt=""
          height={visual.height ?? 24}
          src={visual.src}
          unoptimized={!isRasterAsset}
          width={visual.width ?? 24}
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className="tech-icon tech-icon-monogram"
      style={{ "--tech-color": visual.color } as CSSProperties}
    >
      {visual.letters}
    </span>
  );
}
