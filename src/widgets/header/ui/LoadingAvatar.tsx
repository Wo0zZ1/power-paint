import { cn } from "@/shared/lib/utils";
import { Avatar } from "@/shared/ui";

interface LoadingAvatarProps {
  className?: string;
}

export async function LoadingAvatar({ className }: LoadingAvatarProps) {
  return (
    <Avatar
      className={cn("cursor-pointer animate-pulse", className)}
      size="lg"
      asChild
    >
      <div className="w-10 h-10 rounded-full bg-muted" />
    </Avatar>
  );
}
