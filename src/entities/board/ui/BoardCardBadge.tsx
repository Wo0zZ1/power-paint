import { cn } from "@/utils";

import { Badge } from "@/shared/ui";
import { AccessLevel } from "@prisma/client";

interface BoardCardBadgeProps {
  className?: string;
  type: AccessLevel | null;
}

const getBadgeContent = (type: AccessLevel | null) => {
  switch (type) {
    case AccessLevel.private:
      return "Private";
    case AccessLevel.public_view:
      return "Public";
    case AccessLevel.public_edit:
      return "Public (edit)";
    case null:
    default:
      return "Unknown";
  }
};

export function BoardCardBadge({
  className,
  type,
}: BoardCardBadgeProps) {
  return (
    <Badge
      className={cn(
        "select-auto absolute z-10 top-4 left-4 text-white border-white/10 bg-accent/25 dark:bg-accent-foreground/20",
        className,
      )}
      variant="outline"
    >
      {getBadgeContent(type)}
    </Badge>
  );
}
