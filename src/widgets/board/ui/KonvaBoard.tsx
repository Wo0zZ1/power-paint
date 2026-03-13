"use client";

import type { Board } from "@prisma/client";
import type Konva from "konva";
import { useCallback, useRef } from "react";
import { Layer, Rect, Stage } from "react-konva";

import { useHotKeys } from "../model/input/useHotKeys";
import type { AwarenessUser } from "../model/types";
import { useBoardSize } from "../model/useBoardSize";
import { useBoardStore } from "../model/useBoardStore";
import { useDragElements } from "../model/useDrag";
import { useHocuspocus } from "../model/useHocuspocus";
import { useMouseAwareness } from "../model/useMouseAwareness";
import { useSelectionRect } from "../model/useSelectionRect";
import { shouldPan, useViewport } from "../model/viewport/useViewport";

import { LayerContent } from "./LayerContent";
import { Toolbar } from "./Toolbar";
import { UserCursors } from "./UserCursors";

interface KonvaBoardProps {
  user: AwarenessUser;
  boardId: Board["id"];
}

export function KonvaBoard({ user, boardId }: KonvaBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const cursorsLayerRef = useRef<Konva.Layer>(null);
  const selectionRectRef = useRef<Konva.Rect>(null);

  const globals = useBoardStore((s) => s.globals);
  const viewport = useBoardStore((s) => s.viewport);

  const { stageSize } = useBoardSize({ boardRef });
  const { handleZoom, startPan } = useViewport();
  const { startSelecting } = useSelectionRect({ rectRef: selectionRectRef });

  useHotKeys(true);

  useHocuspocus({ boardId, user });
  const {
    handleMouseMove: handleCursorMove,
    handleMouseLeave: handleCursorLeave,
  } = useMouseAwareness(boardRef);

  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();

      const stage = stageRef.current;
      if (!stage) return;

      const pointerPos = stage.getPointerPosition();
      if (!pointerPos) return;

      handleZoom(pointerPos.x, pointerPos.y, e.evt.deltaY);
    },
    [handleZoom],
  );

  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      const transformer =
        stageRef.current?.findOne<Konva.Transformer>("#transformer");

      if (shouldPan(e.evt.button)) {
        startPan(e.evt.clientX, e.evt.clientY);
        return;
      }

      if (e.evt.button === 0 && e.target.attrs.id !== transformer?.id()) {
        startSelecting(e);
        return;
      }
    },
    [startPan, startSelecting],
  );

  const { startDrag } = useDragElements();

  return (
    <div className="w-full h-full pl-3.75 mr-3.75 rounded-lg overflow-clip">
      <div
        ref={boardRef}
        onMouseMove={handleCursorMove}
        onMouseLeave={handleCursorLeave}
        className="w-full h-full relative"
      >
        <Toolbar className="absolute flex gap-2 z-10" user={user} />

        <Stage
          ref={stageRef}
          className="border border-muted"
          style={{ backgroundColor: globals.backgroundColor }}
          width={stageSize.width}
          height={stageSize.height}
          x={viewport.x}
          y={viewport.y}
          scaleX={viewport.scale}
          scaleY={viewport.scale}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
        >
          <Layer>
            <LayerContent />
            <Rect
              ref={selectionRectRef}
              visible={false}
              fill="rgba(0, 0, 255, 0.1)"
              stroke="blue"
              onMouseDown={(e) => startDrag(e.evt.clientX, e.evt.clientY)}
              strokeWidth={1}
            />
          </Layer>

          <Layer ref={cursorsLayerRef}>
            <UserCursors canvasRef={cursorsLayerRef} />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
