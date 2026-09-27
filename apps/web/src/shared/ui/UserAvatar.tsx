import type { ComponentProps } from "react";

import { cn } from "@/utils";

import type { UserOnlineStatus } from "@/shared/ui";
import { Avatar, AvatarFallback, AvatarImage, UserBadge } from "@/shared/ui";

type UserAvatarProps = {
  className?: string;
  size?: ComponentProps<typeof Avatar>["size"];
  src?: string | null;
  fallback: string;
  status?: UserOnlineStatus;
};

export function UserAvatar({
  className,
  size = "lg",
  fallback,
  src,
  status,
}: UserAvatarProps) {
  return (
    <Avatar className={cn("relative", className)} size={size}>
      {src && (
        <AvatarImage
          fill
          src={src}
          sizes="100%"
          loading="eager"
          alt="User avatar"
          unoptimized={/\.ufs\.sh\//.test(src)}
          className="absolute object-cover w-full h-full"
        />
      )}
      <AvatarFallback>{fallback.slice(0, 2)}</AvatarFallback>

      {status && <UserBadge status={status} />}
    </Avatar>
  );
}
