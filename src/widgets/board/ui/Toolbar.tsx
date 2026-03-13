"use client";

import { useTranslations } from "next-intl";
import { useCallback, type ChangeEvent } from "react";
import { useShallow } from "zustand/react/shallow";

import { getParsedUsername } from "@/shared/lib/utils";

import type { AwarenessUser } from "../model/types";
import { useAddElement } from "../model/useAddElement";
import { useBoardStore } from "../model/useBoardStore";
import { useSetGlobal } from "../model/useSetGlobal";

interface ToolbarProps {
  className?: string;
  user: AwarenessUser;
}

export function Toolbar({ className, user }: ToolbarProps) {
  const t = useTranslations("guestNameParts");

  const globals = useBoardStore(useShallow((s) => s.globals));

  const { guest, name, color } = user;
  const userName = getParsedUsername(name, guest, t);

  const { addRect, addCircle } = useAddElement();

  const setBackgroundColor = useSetGlobal("backgroundColor");

  const handleColorChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setBackgroundColor(e.target.value);
    },
    [setBackgroundColor],
  );

  return (
    <div className={className}>
      <button
        onClick={() => {
          for (let _ = 0; _ < 100; _++) addRect();
        }}
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
        Вы: <strong style={{ color }}>{userName}</strong>
      </span>
      <div className="flex gap-1 p-0.5 bg-black rounded text-sm">
        <p>Current background color: </p>
        <input
          type="color"
          value={globals.backgroundColor}
          className="w-6 h-6 border-none cursor-pointer"
          onChange={handleColorChange}
        />
      </div>
    </div>
  );
}
