import { cn } from "@/utils";

import { CardHeader, CardTitle } from "@/shared/ui";

interface BoardCardHeaderProps {
  className?: string;
  name: string;
}

export function BoardCardHeader({ className, name }: BoardCardHeaderProps) {
  return (
    <CardHeader className={cn(className, "")}>
      <CardTitle className="select-all">{name}</CardTitle>
    </CardHeader>
  );
}
