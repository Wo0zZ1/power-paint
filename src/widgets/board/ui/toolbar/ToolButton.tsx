"use client";

import type { ComponentProps, ElementType } from "react";

import type { Tool } from "@/shared/constants";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui";

import { useBoardStore } from "../../model";

interface ToolButtonProps {
  className?: string;
  isActive?: boolean;
  tool: Tool;
  Icon: ElementType;
}

export function ToolButton({
  className,
  isActive,
  tool,
  Icon,
  ...props
}: ToolButtonProps & ComponentProps<typeof Button>) {
  const setTool = useBoardStore((s) => s.setTool);

  return (
    <Button
      {...props}
      size="icon-sm"
      onClick={() => setTool(tool)}
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        { "bg-card cursor-default": isActive },
        "hover:bg-card/65!",
        className,
      )}
    >
      <Icon className="size-4" />
    </Button>
  );
}
