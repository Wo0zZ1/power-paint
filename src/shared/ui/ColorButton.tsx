"use client";

import { cn } from "@/utils";

import { useInvertableColor } from "../lib/hooks";

import { ColorSwatch } from "./ColorSwatch";

interface ColorButtonProps {
  className?: string;
  onSelect?: (color: string) => void;
  color: string;
  active?: boolean;
  invertable?: boolean;
}

export function ColorButton({
  className,
  onSelect,
  color,
  active,
  invertable = false,
  ...props
}: ColorButtonProps) {
  const { activeColor } = useInvertableColor(color, invertable);

  return (
    <button
      type="button"
      key={color}
      onClick={() => onSelect?.(color)}
      style={{
        outlineColor: activeColor,
        outlineStyle: active ? "solid" : "none",
      }}
      className={cn(
        `flex size-6 border rounded-sm cursor-pointer overflow-hidden outline-offset-1`,
        className,
      )}
      {...props}
    >
      <ColorSwatch color={activeColor} />
    </button>
  );
}
