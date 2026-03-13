"use client";

import type Konva from "konva";
import type { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { useCallback, useEffect, useRef } from "react";
import { Transformer } from "react-konva";

import type {
  CircleElementType,
  RectElementType,
} from "../model/element/types";
import { useBoardStore } from "../model/useBoardStore";
import { useDragElements } from "../model/useDrag";
import { useTransformer } from "../model/useTransformer";
import { shouldPan } from "../model/viewport/useViewport";

import { CircleElement } from "./CircleElement";
import { RectElement } from "./RectElement";

export function LayerContent() {
  const transformerRef = useRef<Konva.Transformer>(null);

  const elements = useBoardStore((s) => s.elements);
  const selectedIds = useBoardStore((s) => s.selectedIds);

  const { startDrag } = useDragElements();

  const onDelete = useCallback(
    (e: KonvaEventObject<PointerEvent, Node<NodeConfig>>) => {
      useBoardStore.getState().removeElement(e.target.attrs.id);
    },
    [],
  );

  const handleMouseDown = useCallback(
    (e: KonvaEventObject<PointerEvent, Node<NodeConfig>>) => {
      if (shouldPan(e.evt.button)) return;

      startDrag(e.evt.clientX, e.evt.clientY);
    },
    [startDrag],
  );

  const { handleTransformStart, handleTransform } = useTransformer();

  useEffect(() => {
    const stage = transformerRef.current?.getStage();
    if (!stage || !transformerRef.current) return;

    const nodes = (
      Array.from(selectedIds)
        .map((id) => stage.findOne(`#${id}`))
        .filter(Boolean) as Node[]
    ).filter((node) => node.id() !== transformerRef.current?.id());

    transformerRef.current.nodes(nodes);
  }, [selectedIds]);

  return (
    <>
      {Array.from(elements.values()).map((el) => {
        const commonProps = {
          isSelected: selectedIds.has(el.id),
          onMouseDown: handleMouseDown,
          onContextMenu: onDelete,
        };

        switch (el.type) {
          case "rect":
            return <RectElement key={el.id} {...commonProps} element={el} />;
          case "circle":
            return <CircleElement key={el.id} {...commonProps} element={el} />;
          default:
            return null;
        }
      })}

      <Transformer
        id="transformer"
        rotationSnapTolerance={5}
        keepRatio={false}
        rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
        onTransformStart={handleTransformStart}
        onTransform={handleTransform}
        anchorCornerRadius={100}
        ref={transformerRef}
      />
    </>
  );
}
