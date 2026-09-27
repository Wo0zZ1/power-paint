"use client";

import { cn } from "@/utils";

import { useInvertableColor } from "@/shared/lib/hooks";

interface ColorSwatchProps {
  className?: string;
  color: string;
  invertable?: boolean;
  opacity?: number;
}

export function ColorSwatch({
  className,
  color,
  invertable = false,
  opacity,
}: ColorSwatchProps) {
  const { activeColor, isLoading } = useInvertableColor(color, invertable);

  if (isLoading) return null;

  return (
    <div
      className={cn("aspect-square", className)}
      style={{ backgroundColor: activeColor, opacity }}
    />
  );
}
