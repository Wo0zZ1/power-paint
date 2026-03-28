import { User2 } from "lucide-react";

import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/shared/ui";
import { cn } from "@/utils";

interface EmptyWorkspaceMembersProps {
  className?: string;
  title?: string;
}

export function EmptyWorkspaceMembers({
  className,
  title,
}: EmptyWorkspaceMembersProps) {
  return (
    <Empty size="sm" className={cn("mt-2", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <User2 />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
}
