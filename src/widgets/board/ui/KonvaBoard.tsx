"use client";

import type { Board } from "@prisma/client";
import type Konva from "konva";
import { useRef } from "react";
import { Layer, Stage } from "react-konva";
import { useShallow } from "zustand/react/shallow";

import { AccessRole } from "@/shared/constants";
import { useWindowSize, useInvertableColor } from "@/shared/lib/hooks";

import type { UserAwareness } from "../model";
import {
  useBoardStore,
  useHotKeys,
  useHocuspocus,
  useMouseAwareness,
  useBoardInteraction,
} from "../model";
import { useBoardPreview } from "../model/core/useBoardPreview";

import { LayerContent, TransformerTool, SelectionElement } from "./elements";
import {
  UndoRedoControls,
  ZoomControls,
  UserCursors,
  DeleteSelectionButton,
} from "./overlay";
import { ActiveUsers } from "./overlay/ActiveUsers";
import { ConnectionStatus } from "./overlay/ConnectionStatus";
import { LeftSidebar } from "./sidebar";
import { BottomToolbar } from "./toolbar";

interface KonvaBoardProps {
  userAwareness: UserAwareness;
  accessToken: string;
  boardId: Board["id"];
  accessRole: AccessRole;
}

export function KonvaBoard({
  userAwareness,
  accessToken,
  boardId,
  accessRole,
}: KonvaBoardProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const contentLayerRef = useRef<Konva.Layer>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const selectionRectRef = useRef<Konva.Rect>(null);

  const globals = useBoardStore(useShallow((s) => s.globals));
  const viewport = useBoardStore(useShallow((s) => s.viewport));

  const canEdit = AccessRole[accessRole] >= AccessRole.EDITOR;

  useHotKeys();
  useBoardPreview({ ref: contentLayerRef, boardId });
  useHocuspocus({ userAwareness, accessToken, boardId });

  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const { activeColor } = useInvertableColor(globals.backgroundColor, true);

  const { handleTouchMove, handlePointerMove, handlePointerLeave } =
    useMouseAwareness();

  const connectionStatus = useBoardStore((s) => s.connectionStatus);

  const { handlePointerDown, handleTouchStart, handleZoom } =
    useBoardInteraction({ selectionRectRef, canEdit });

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
          {/* Top Right */}
          <div className="absolute flex items-start gap-4 top-0 right-0">
            <ConnectionStatus status={connectionStatus} />
            <ActiveUsers className="pointer-events-auto" />
          </div>

          {/* Top Left */}
          {canEdit && (
            <LeftSidebar className="hidden md:block pointer-events-auto absolute top-0 left-0" />
          )}

          {/* Bottom Left */}
          <div className="absolute bottom-0 left-0 hidden md:flex gap-4">
            <ZoomControls className="pointer-events-auto" />
            {canEdit && <UndoRedoControls className="pointer-events-auto" />}
          </div>

          {/* Bottom Center */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col gap-2 md:block">
            <div className="md:hidden flex">
              {canEdit && (
                <DeleteSelectionButton className="pointer-events-auto" />
              )}

              {canEdit && (
                <UndoRedoControls
                  className="pointer-events-auto ml-auto"
                  tooltipActive={false}
                />
              )}
            </div>

            <BottomToolbar
              tools={!canEdit ? ["select", "hand"] : undefined}
              className="pointer-events-auto"
            />
          </div>
        </div>

        <Stage
          ref={stageRef}
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
          <Layer ref={contentLayerRef}>
            <LayerContent canEdit={canEdit} />
          </Layer>

          <Layer>
            <TransformerTool
              contentLayerRef={contentLayerRef}
              canEdit={canEdit}
            />
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
