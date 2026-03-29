import Image from "next/image";
import type { ImageProps } from "next/image";
import Link from "next/link";

import { ROUTES } from "@/shared/config";
import { cn } from "@/utils";

interface BoardCardImageProps {
  className?: string;
  boardId: string;
  imageProps: ImageProps;
}

export function BoardCardImage({
  className,
  boardId,
  imageProps: { alt, ...props },
}: BoardCardImageProps) {
  return (
    <div className={cn("", className)}>
      <Link
        className="relative w-full h-full block aspect-video"
        href={ROUTES.BOARD(boardId)}
      >
        <Image
          className="relative"
          loading="eager"
          quality={25}
          alt={alt}
          {...props}
        />
      </Link>
    </div>
  );
}
