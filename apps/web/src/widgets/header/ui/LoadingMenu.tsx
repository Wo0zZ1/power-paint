import { LoadingAvatar } from "./LoadingAvatar";

interface LoadingMenuProps {
  className?: string;
}

export async function LoadingMenu({ className }: LoadingMenuProps) {
  return <LoadingAvatar className={className} />;
}
