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
        "*:grow flex items-center gap-2 overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-thumb]:hover:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full",
        className,
      )}
    >
      {children}
    </div>
  );
}
