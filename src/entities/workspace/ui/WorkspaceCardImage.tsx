import Image from "next/image";
import Link from "next/link";

import preview from "@/public/assets/preview1.jpeg";
import { ROUTES } from "@/shared/config";
import { cn } from "@/utils";

interface WorkspaceCardImageProps {
  className?: string;
  workspaceId: string;
}

export function WorkspaceCardImage({
  className,
  workspaceId,
}: WorkspaceCardImageProps) {
  return (
    <div className={cn(className, "")}>
      <Link
        className="relative w-full h-full block aspect-video"
        href={ROUTES.DASHBOARD.WORKSPACE(workspaceId)}
      >
        <Image
          fill
          quality={75}
          sizes="100%"
          loading="lazy"
          src={preview.src}
          placeholder="blur"
          blurDataURL={preview.src}
          alt="Workspace preview image"
        />
      </Link>
    </div>
  );
}
