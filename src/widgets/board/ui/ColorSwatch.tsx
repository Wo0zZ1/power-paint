import { cn } from "@/utils";

interface ColorSwatchProps {
  className?: string;
  color: string;
}

export function ColorSwatch({ className, color }: ColorSwatchProps) {
  return (
    <div
      className={cn("aspect-square", className)}
      style={{ backgroundColor: color }}
    />
  );
}
