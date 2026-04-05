"use client";

import { cn } from "@/utils";

import { useInvertableColor } from "@/shared/lib/hooks";

interface ColorSwatchProps {
  className?: string;
  color: string;
  invertable?: boolean;
}

export function ColorSwatch({
  className,
  color,
  invertable = false,
}: ColorSwatchProps) {
  const { activeColor, isLoading } = useInvertableColor(color, invertable);

  if (isLoading) return null;

  return (
    <div
      className={cn("aspect-square", className)}
      style={{ backgroundColor: activeColor }}
    />
  );
}
