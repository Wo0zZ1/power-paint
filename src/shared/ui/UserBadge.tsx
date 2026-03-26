import { cn } from "@/utils";

import { AvatarBadge } from "./avatar";

export type UserOnlineStatus = "online" | "offline";

interface UserBadgeProps {
  className?: string;
  status: UserOnlineStatus;
}

export function UserBadge({ className, status }: UserBadgeProps) {
  switch (status) {
    case "online":
      return <AvatarBadge className={cn("bg-green-500", className)} />;
    case "offline":
      return <AvatarBadge className={cn("bg-gray-500", className)} />;
    default:
      const _: never = status;
      return _;
  }
}
