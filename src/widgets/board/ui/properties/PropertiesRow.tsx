import type { PropsWithChildren } from "react";

import { cn } from "@/utils";

interface PropertiesRowProps {
  className?: string;
}

export function PropertiesRow({
  className,
  children,
}: PropsWithChildren<PropertiesRowProps>) {
  return (
    <div
      className={cn(
        "*:grow flex items-center gap-2 overflow-x-auto overflow-y-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}
