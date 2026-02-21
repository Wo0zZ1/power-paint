import Image, { StaticImageData } from "next/image";

import { cn } from "@/utils";
import { ROUTES } from "@/shared/config";
import Link from "next/link";

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
