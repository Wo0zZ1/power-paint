import type { PropsWithChildren } from "react";

import { cn } from "@/utils";

interface SidebarBlockProps {
  className?: string;
  title: string;
}

export function SidebarBlock({
  className,
  title,
  children,
}: PropsWithChildren<SidebarBlockProps>) {
  return (
    <div className={cn(className, "flex flex-col gap-y-2")}>
      <h3 className="leading-relaxed text-xs font-extrabold tracking-tight text-muted-foreground uppercase">
        {title}
      </h3>
      {children}
    </div>
  );
}
