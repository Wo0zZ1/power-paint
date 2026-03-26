import type { UserOnlineStatus } from "@/shared/ui";
import { Avatar, AvatarFallback, AvatarImage, UserBadge } from "@/shared/ui";
import { cn } from "@/utils";

type UserAvatarProps = {
  className?: string;
  src?: string | null;
  fallback: string;
  status?: UserOnlineStatus;
};

export function UserAvatar({
  className,
  fallback,
  src,
  status,
}: UserAvatarProps) {
  return (
    <Avatar className={cn("", className)} size="lg">
      {src && (
        <AvatarImage
          src={src}
          loading="eager"
          width={40}
          height={40}
          alt="User avatar"
        />
      )}
      <AvatarFallback>{fallback.slice(0, 2)}</AvatarFallback>

      {status && <UserBadge status={status} />}
    </Avatar>
  );
}
