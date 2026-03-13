"use client";

import type { Board } from "@prisma/client";
import {
  useCallback,
  useEffect,
  useRef,
  type ChangeEvent,
  type RefObject,
} from "react";
import type * as Y from "yjs";

import type { AwarenessUser, Element } from "../model/types";
import { useAddElement } from "../model/useAddElement";
import { useGlobals } from "../model/useGlobals";

interface ToolbarProps {
  className?: string;
  elementsRef: RefObject<Y.Array<Element> | null>;
  globals?: { backgroundColor: string };
  globalsRef: RefObject<Y.Map<unknown> | null>;
  user: AwarenessUser;
  boardId: Board["id"];
}

export function Toolbar({
  className,
  elementsRef,
  globals,
  globalsRef,
  user,
  boardId,
}: ToolbarProps) {
  const { addRect, addCircle } = useAddElement({ elementsRef });

  const { setGlobal } = useGlobals("backgroundColor", globalsRef);

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGlobal(e.target.value);
  };

  return (
    <div className={className}>
      <button
        onClick={addRect}
        className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
      >
        Create Rectangle
      </button>
      <button
        onClick={addCircle}
        className="px-3 py-1 bg-pink-500 text-white rounded text-sm"
      >
        Create Circle
      </button>
      <span className="px-3 py-1 bg-black rounded text-sm">
        Вы: <strong style={{ color: user.color }}>{user.name}</strong>
      </span>
      <div className="flex gap-1 p-0.5 bg-black rounded text-sm">
        <p>Current background color: </p>
        <input
          type="color"
          defaultValue={globals?.backgroundColor}
          className="w-6 h-6 border-none cursor-pointer"
          onChange={handleColorChange}
        />
      </div>
    </div>
  );
}
