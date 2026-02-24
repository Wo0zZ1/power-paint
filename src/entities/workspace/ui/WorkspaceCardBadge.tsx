import { cn, getBadgeContentByAccessRole } from "@/utils";

import { Badge } from "@/shared/ui";
import { AccessRole } from "@/shared/constants";

interface WorkspaceCardBadgeProps {
  className?: string;
  accessRole: AccessRole;
}

export function WorkspaceCardBadge({
  className,
  accessRole,
}: WorkspaceCardBadgeProps) {
  return (
    <Badge
      className={cn(
        "select-auto absolute z-10 top-4 left-4 text-white border-white/10 bg-accent/25 dark:bg-accent-foreground/20",
        className,
      )}
      variant="outline"
    >
      {getBadgeContentByAccessRole(accessRole)}
    </Badge>
  );
}
