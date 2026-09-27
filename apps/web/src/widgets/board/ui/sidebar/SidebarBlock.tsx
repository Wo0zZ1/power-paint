import type { PropsWithChildren, ReactNode } from "react";

import { cn } from "@/utils";

interface SidebarBlockProps {
  className?: string;
  title: string;
  action?: ReactNode;
}

export function SidebarBlock({
  className,
  title,
  action,
  children,
}: PropsWithChildren<SidebarBlockProps>) {
  return (
    <div className={cn(className, "flex flex-col gap-y-2")}>
      <div className="flex items-center justify-between">
        <h3 className="leading-relaxed text-xs font-extrabold tracking-tight text-muted-foreground uppercase">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}
