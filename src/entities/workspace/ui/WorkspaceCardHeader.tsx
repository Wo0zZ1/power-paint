import { CardHeader, CardTitle } from "@/shared/ui";
import { cn } from "@/utils";


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
