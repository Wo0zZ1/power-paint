"use client";

import type { Board } from "@prisma/client";
import type Konva from "konva";
import { useCallback, useEffect, useRef } from "react";
import { Layer, Stage } from "react-konva";
import { useShallow } from "zustand/react/shallow";

import { useTheme, getSystemTheme } from "@/features/theme-switcher";
import { hexToHsl, invertHslColor } from "@/shared/lib/utils";

import type { AwarenessUser } from "../model/types";
import { useBoardSize } from "../model/useBoardSize";
import { useBoardStore } from "../model/useBoardStore";
import { useDrawing } from "../model/useDrawing";
import { useHocuspocus } from "../model/useHocuspocus";
import { useHotKeys } from "../model/useHotKeys";
import { useMouseAwareness } from "../model/useMouseAwareness";
import { useSelectionRect } from "../model/useSelectionRect";
import { shouldPan, useViewport } from "../model/useViewport";

import { BottomToolbar } from "./BottomToolbar";
import { LayerContent } from "./LayerContent";
import { LeftSidebar } from "./LeftSidebar";
import { SelectionRect } from "./SelectionRect";
import { TransformerTool } from "./TransformerTool";
import { UndoRedoControls } from "./UndoRedoControls";
import { UserCursors } from "./UserCursors";
import { ZoomControls } from "./ZoomControls";

interface KonvaBoardProps {
  user: AwarenessUser;
  boardId: Board["id"];
}

export function KonvaBoard({ user, boardId }: KonvaBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const selectionRectRef = useRef<Konva.Rect>(null);

  const globals = useBoardStore(useShallow((s) => s.globals));
  const viewport = useBoardStore(useShallow((s) => s.viewport));

  const { themePreference } = useTheme();

  useHotKeys();
  useHocuspocus({ boardId, user });

  const { stageSize } = useBoardSize({ boardRef });

  const { handleCursorMove, handleTouchCursorMove, handleCursorLeave } =
    useMouseAwareness();

  const { handleZoom, startPointerPan, startTouchPan } = useViewport();

  const { startPointerDraw, startTouchDraw } = useDrawing();

  const { startPointerSelect, startTouchSelect } = useSelectionRect({
    rectRef: selectionRectRef,
  });

  const handlePointerDown = useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>) => {
      if (e.evt.pointerType === "touch") return;

      if (shouldPan(e.evt)) return startPointerPan(e);

      if (e.evt.button !== 0) return;

      const { tool, clearSelection } = useBoardStore.getState();

      if (tool === "select") return startPointerSelect(e);

      clearSelection();

      if (tool === "draw") return startPointerDraw(e);
    },
    [startPointerPan, startPointerSelect, startPointerDraw],
  );

  const handleTouchStart = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      if (e.evt.cancelable) e.evt.preventDefault();

      const { tool, clearSelection } = useBoardStore.getState();

      if (tool === "hand" || e.evt.touches.length >= 2) return startTouchPan(e);

      if (e.evt.touches.length > 1) return;

      if (tool === "select") return startTouchSelect(e);

      clearSelection();

      if (tool === "draw") return startTouchDraw(e);
    },
    [startTouchPan, startTouchSelect, startTouchDraw],
  );

  useEffect(() => {
    if (!stageRef.current) return;

    const resolvedTheme =
      themePreference === "system" ? getSystemTheme() : themePreference;

    try {
      const hslBackgroundColor = hexToHsl(globals.backgroundColor);

      const backgroundColor =
        resolvedTheme === "dark"
          ? invertHslColor(hslBackgroundColor)
          : hslBackgroundColor;

      stageRef.current.container().style.backgroundColor = backgroundColor;
    } catch (error) {
      console.error("Failed to set background color:", error);
    }
  }, [themePreference, globals.backgroundColor]);

  return (
    <div className="w-full h-full min-w-0 min-h-0 px-3.75 rounded-lg overflow-hidden">
      <div
        ref={boardRef}
        onPointerMove={handleCursorMove}
        onTouchMove={handleTouchCursorMove}
        onPointerLeave={handleCursorLeave}
        className="w-full h-full min-w-0 min-h-0 relative select-none overflow-hidden touch-none"
      >
        <div className="absolute inset-5 pointer-events-none z-10">
          <div className="pointer-events-auto">
            <LeftSidebar className="absolute top-0 left-0 z-10" />
            <BottomToolbar className="absolute bottom-0 left-1/2 -translate-x-1/2" />

            <div className="absolute bottom-0 left-0 flex gap-4">
              <ZoomControls />
              <UndoRedoControls />
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 left-3 z-10 flex gap-4"></div>

        <Stage
          ref={stageRef}
          className="border border-muted"
          width={stageSize.width}
          height={stageSize.height}
          x={viewport.x}
          y={viewport.y}
          scaleX={viewport.scale}
          scaleY={viewport.scale}
          onWheel={handleZoom}
          onPointerDown={handlePointerDown}
          onTouchStart={handleTouchStart}
        >
          <Layer>
            <LayerContent />
            <TransformerTool />
          </Layer>

          <Layer>
            <SelectionRect rectRef={selectionRectRef} />
          </Layer>

          <Layer>
            <UserCursors />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
