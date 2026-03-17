"use client";

import {
  Circle,
  Eraser,
  Hand,
  MousePointer2,
  Pencil,
  Square,
  Type,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { ElementType } from "react";

import { cn } from "@/shared/lib/utils";
import { Kbd, Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";

import type { Tool } from "../model/types";
import { useBoardStore } from "../model/useBoardStore";

import { ToolButton } from "./ToolButton";

const tools: { tool: Tool; Icon: ElementType; shortcut: string }[] = [
  { tool: "select", Icon: MousePointer2, shortcut: "S" },
  { tool: "hand", Icon: Hand, shortcut: "H" },
  { tool: "rect", Icon: Square, shortcut: "R" },
  { tool: "circle", Icon: Circle, shortcut: "C" },
  { tool: "draw", Icon: Pencil, shortcut: "D" },
  { tool: "eraser", Icon: Eraser, shortcut: "E" },
  { tool: "text", Icon: Type, shortcut: "T" },
];

interface BottomToolbarProps {
  className?: string;
}

export function BottomToolbar({ className }: BottomToolbarProps) {
  const t = useTranslations("toolbar.tools");

  const activeTool = useBoardStore((s) => s.tool);

  return (
    <div
      className={cn(
        className,
        "flex gap-1 rounded-lg p-1 border bg-secondary/85 before:content-[''] before:-z-1 before:rounded-lg before:absolute before:inset-0 before:bg-primary/0 backdrop-blur-sm shadow-md",
      )}
    >
      {tools.map(({ tool, Icon, shortcut }) => (
        <Tooltip key={tool} disableHoverableContent>
          <TooltipTrigger asChild>
            <ToolButton
              tool={tool}
              Icon={Icon}
              isActive={tool === activeTool}
            />
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={4}>
            {t(tool)} <Kbd>{shortcut}</Kbd>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
