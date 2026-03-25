"use client";

import type { Board } from "@prisma/client";
import type Konva from "konva";
import { useRef } from "react";
import { Layer, Stage } from "react-konva";
import { useShallow } from "zustand/react/shallow";

import { useWindowSize, useInvertableColor } from "@/shared/lib/hooks";

import type { AwarenessUser } from "../model";
import {
  useBoardStore,
  useHotKeys,
  useHocuspocus,
  useMouseAwareness,
  useBoardInteraction,
} from "../model";

import { LayerContent, TransformerTool, SelectionElement } from "./elements";
import { UndoRedoControls, ZoomControls, UserCursors } from "./overlay";
import { LeftSidebar } from "./sidebar";
import { BottomToolbar } from "./toolbar";

interface KonvaBoardProps {
  user: AwarenessUser;
  accessToken: string;
  boardId: Board["id"];
}

export function KonvaBoard({ user, accessToken, boardId }: KonvaBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const selectionRectRef = useRef<Konva.Rect>(null);

  const globals = useBoardStore(useShallow((s) => s.globals));
  const viewport = useBoardStore(useShallow((s) => s.viewport));

  useHotKeys();
  useHocuspocus({ user, accessToken, boardId });

  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const { activeColor } = useInvertableColor(globals.backgroundColor, true);

  const { handleTouchMove, handlePointerMove, handlePointerLeave } =
    useMouseAwareness();

  const { handlePointerDown, handleTouchStart, handleZoom } =
    useBoardInteraction({ selectionRectRef });

  return (
    <div className="w-full h-full min-w-0 min-h-0 overflow-hidden">
      <div
        ref={boardRef}
        onTouchMove={handleTouchMove}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="w-full h-full min-w-0 min-h-0 relative select-none overflow-hidden touch-none"
      >
        <div className="absolute w-auto mx-auto inset-5 pointer-events-none z-11">
          {/* Mobile */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 space-y-2 md:hidden">
            <div className="flex gap-4">
              <></>
              {/* / */}
              <UndoRedoControls
                className="pointer-events-auto ml-auto"
                tooltipActive={false}
              />
            </div>

            <BottomToolbar
              tooltipActive={false}
              className="pointer-events-auto"
            />
          </div>
          {/* Desktop */}
          <div className="not-md:hidden">
            <LeftSidebar className="pointer-events-auto absolute top-0 left-0" />
            <BottomToolbar className="pointer-events-auto absolute bottom-0 left-1/2 -translate-x-1/2" />

            <div className="absolute bottom-0 left-0 flex gap-4">
              <ZoomControls className="pointer-events-auto" />
              <UndoRedoControls className="pointer-events-auto" />
            </div>
          </div>
        </div>

        <Stage
          style={{ backgroundColor: activeColor }}
          width={windowWidth - 2} // Borders
          height={windowHeight - 2 - 72} // Borders + header
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
            <SelectionElement rectRef={selectionRectRef} />
          </Layer>

          <Layer>
            <UserCursors />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
