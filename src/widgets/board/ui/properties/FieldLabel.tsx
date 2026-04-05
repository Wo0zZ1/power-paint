import { cn } from "@/utils";

import { Label } from "@/shared/ui";

interface FieldLabelProps {
  className?: string;
  label: string;
}

export function FieldLabel({ className, label }: FieldLabelProps) {
  return (
    <Label
      className={cn(
        "min-w-4 text-sm uppercase text-muted-foreground shrink-0",
        className,
      )}
    >
      {label}
    </Label>
  );
}
