import { cn } from "@/utils";

import { CardHeader, CardTitle } from "@/shared/ui";


interface WorkspaceCardHeaderProps {
  className?: string;
  name: string;
}

export function WorkspaceCardHeader({
  className,
  name,
}: WorkspaceCardHeaderProps) {
  return (
    <CardHeader className={cn(className, "")}>
      <CardTitle className="select-all">{name}</CardTitle>
    </CardHeader>
  );
}
