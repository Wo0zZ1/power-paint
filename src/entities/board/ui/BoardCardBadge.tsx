import type { AccessRole } from "@/shared/constants";
import { Badge } from "@/shared/ui";
import { cn, getBadgeContentByAccessRole } from "@/utils";

interface BoardCardBadgeProps {
  className?: string;
  accessRole: AccessRole;
}

export function BoardCardBadge({ className, accessRole }: BoardCardBadgeProps) {
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
