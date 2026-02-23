import Image, { StaticImageData } from "next/image";

import { cn } from "@/utils";
import { ROUTES } from "@/shared/config";
import Link from "next/link";

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
          className="relative aspect-video"
          alt="Workspace preview image"
          quality={25}
          loading="eager"
          src={imageProps}
        />
      </Link>
    </div>
  );
}
