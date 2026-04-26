"use client";

import { useTranslations } from "next-intl";

import type { Tool } from "@/shared/constants";
import { TOOLS } from "@/shared/constants";
import { cn } from "@/shared/lib/utils";
import { TooltipTrigger, TooltipContent, Kbd, Tooltip } from "@/shared/ui";

import { useBoardStore } from "../../model";

import { ToolButton } from "./ToolButton";

interface BottomToolbarProps {
  className?: string;
  tooltipActive?: boolean;
  tools?: [...Tool[]];
}

export function BottomToolbar({
  className,
  tooltipActive = true,
  tools = TOOLS.map((t) => t.tool),
}: BottomToolbarProps) {
  const t = useTranslations("toolbar.tools");

  const activeTool = useBoardStore((s) => s.tool);

  const filteredTools = TOOLS.filter(({ tool }) => tools.includes(tool));

  return (
    <div
      role="toolbar"
      aria-label="Board tools"
      className={cn(
        className,
        "flex gap-1 rounded-lg p-1 border bg-secondary/85 before:content-[''] before:-z-1 before:rounded-lg before:absolute before:inset-0 before:bg-primary/0 backdrop-blur-sm shadow-md",
      )}
    >
      <ul className="contents">
        {filteredTools.map(({ tool, Icon, shortcut }) => (
          <li className="contents" aria-label={t(tool)} key={tool}>
            <Tooltip
              open={tooltipActive ? undefined : false}
              disableHoverableContent
            >
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
          </li>
        ))}
      </ul>
    </div>
  );
}
