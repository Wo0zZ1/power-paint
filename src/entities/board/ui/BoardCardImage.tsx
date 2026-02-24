import type { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";

import { ROUTES } from "@/shared/config";
import { cn } from "@/utils";

interface BoardCardImageProps {
  className?: string;
  boardId: string;
  imageProps: StaticImageData;
}

export function BoardCardImage({
  className,
  boardId,
  imageProps,
}: BoardCardImageProps) {
  return (
    <div className={cn(className, "")}>
      <Link href={ROUTES.BOARD(boardId)}>
        <Image
          className="relative aspect-video"
          alt="Board preview image"
          quality={25}
          loading="eager"
          src={imageProps}
        />
      </Link>
    </div>
  );
}
