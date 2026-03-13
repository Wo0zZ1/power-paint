"use client";

import type { Board } from "@prisma/client";
import { useRef } from "react";
import { Layer, Stage } from "react-konva";

import type { AwarenessUser } from "../model/types";
import { useBoardSize } from "../model/useBoardSize";
import { useDrag } from "../model/useDrag";
import { useHocuspocus } from "../model/useHocuspocus";
import { useMouseAwareness } from "../model/useMouseAwareness";

import { LayerContent } from "./LayerContent";
import { Toolbar } from "./Toolbar";
import { UserCursors } from "./UserCursors";

interface KonvaBoardProps {
  user: AwarenessUser;
  boardId: Board["id"];
}

export function KonvaBoard({ user, boardId }: KonvaBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);

  const { stageSize } = useBoardSize({ boardRef });

  const {
    providerRef,
    elementsRef,
    elements,
    globalsRef,
    globals,
    remoteCursors,
  } = useHocuspocus({
    boardId,
    user,
  });

  const { handleMouseMove, handleMouseLeave } = useMouseAwareness({
    boardRef,
    providerRef,
  });

  const { handleDrag } = useDrag({ elementsRef });

  return (
    <div className="w-full h-full pl-3.75 mr-3.75 rounded-lg overflow-clip">
      <div
        ref={boardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full relative"
      >
        <Toolbar
          className="absolute flex gap-2 z-10"
          elementsRef={elementsRef}
          user={user}
          boardId={boardId}
          globals={globals}
          globalsRef={globalsRef}
        />

        <Stage
          className="border border-muted "
          style={{ backgroundColor: globals?.backgroundColor }}
          width={stageSize.width}
          height={stageSize.height}
        >
          <Layer>
            <LayerContent elements={elements} handleDrag={handleDrag} />

            <UserCursors remoteCursors={remoteCursors} />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
