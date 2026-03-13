"use client";

import { cn } from "@/utils";

import { ColorSwatch } from "./ColorSwatch";

interface BackgroundColorButtonProps {
  className?: string;
  onSelect?: (color: string) => void;
  color: string;
  active?: boolean;
}

export function BackgroundColorButton({
  className,
  onSelect,
  color,
  active,
  ...props
}: BackgroundColorButtonProps) {
  return (
    <button
      key={color}
      onClick={() => onSelect?.(color)}
      className={cn(
        `flex size-6 border rounded-sm cursor-pointer overflow-hidden outline-offset-1`,
        { "outline outline-primary": active },
        className,
      )}
      {...props}
    >
      <ColorSwatch color={color} />
    </button>
  );
}
