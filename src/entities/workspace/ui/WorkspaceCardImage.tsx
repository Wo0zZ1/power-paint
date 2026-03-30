import type { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";

import { ROUTES } from "@/shared/config";
import { cn } from "@/utils";

interface WorkspaceCardImageProps {
  className?: string;
  workspaceId: string;
  imageProps: StaticImageData;
}

export function WorkspaceCardImage({
  className,
  workspaceId,
  imageProps,
}: WorkspaceCardImageProps) {
  return (
    <div className={cn(className, "")}>
      <Link href={ROUTES.DASHBOARD.WORKSPACE(workspaceId)}>
        <Image
          quality={75}
          loading="eager"
          src={imageProps}
          alt="Workspace preview image"
          className="relative aspect-video"
        />
      </Link>
    </div>
  );
}
