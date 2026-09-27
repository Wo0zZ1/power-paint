/* eslint-disable jsx-a11y/alt-text */
import { useState, type ComponentProps } from "react";
import type { Ellipse } from "react-konva";
import { Image, Rect, Text } from "react-konva";
import { useImage } from "react-konva-utils";
import { useShallow } from "zustand/react/shallow";

import { useInvertableColor } from "@/shared/lib/hooks";

import type { ImageElementType } from "../../model";
import { useBoardStore, getDash, getOpacity } from "../../model";

type ImageElementProps = {
  element: ImageElementType;
  canEdit: boolean;
} & Omit<ComponentProps<typeof Ellipse>, "radiusX" | "radiusY">;

export function ImageElement({ element, ...props }: ImageElementProps) {
  const selectedIds = useBoardStore(useShallow((s) => s.selectedIds));
  const selectionType = useBoardStore((s) => s.selectionType);
  const uploadState = useBoardStore((s) => s.imageUploads[element.id]);
  const isSelected = selectedIds.has(element.id);

  const [prevImage, setPrevImage] = useState<HTMLImageElement | undefined>();
  const [image, status] = useImage(element.imageUrl, "anonymous"); // TODO: handle auth properly

  if (image && prevImage !== image) setPrevImage(image);

  const dash = getDash(element.strokeType);

  const opacity = getOpacity(element.opacity, isSelected, selectionType);

  const { activeColor: strokeColor } = useInvertableColor(element.strokeColor);

  const isUploading = uploadState?.status === "uploading";
  const isUploadFailed = uploadState?.status === "failed";
  const isFailed = isUploadFailed || status === "failed";
  const isLoaded = status === "loaded";
  const showPlaceholder =
    !prevImage && (isUploading || isUploadFailed || !isLoaded);
  const placeholderSize = Math.min(element.width, element.height);

  const accentColor = isFailed ? "#ef4444" : "#a1a1aa";
  const fillColor = isFailed ? "#450a0a" : "#262626";
  const text = isFailed ? "Image failed" : "Loading image";

  return (
    <>
      {showPlaceholder && (
        <>
          <Rect
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            rotation={element.rotation}
            opacity={0.75}
            fill={fillColor}
            listening={false}
          />
          <Text
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            rotation={element.rotation}
            text={text}
            fill={accentColor}
            align="center"
            verticalAlign="middle"
            fontSize={Math.max(12, Math.min(18, placeholderSize / 8))}
            fontStyle="500"
            listening={false}
          />
        </>
      )}
      <Image
        image={image || prevImage}
        id={element.id}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        rotation={element.rotation}
        opacity={opacity}
        // Stroke
        hitStrokeWidth={22}
        strokeScaleEnabled={true}
        fillAfterStrokeEnabled={true}
        stroke={strokeColor}
        strokeWidth={element.strokeWidth}
        dash={dash}
        // Others
        {...props}
      />
    </>
  );
}
