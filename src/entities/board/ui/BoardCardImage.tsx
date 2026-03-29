import Image from "next/image";
import Link from "next/link";

import { ROUTES } from "@/shared/config";
import { cn } from "@/utils";

import preview1 from "../../../../public/assets/preview1.jpeg";

interface BoardCardImageProps {
  className?: string;
  boardId: string;
  lightPreview: string | null;
  darkPreview: string | null;
}

export function BoardCardImage({
  className,
  boardId,
  lightPreview,
  darkPreview,
}: BoardCardImageProps) {
  return (
    <div className={cn("", className)}>
      <Link
        className="relative w-full h-full block aspect-video"
        href={ROUTES.BOARD(boardId)}
      >
        {lightPreview && (
          <Image
            className="relative dark:hidden"
            loading="eager"
            quality={25}
            src={lightPreview}
            alt="Board preview image"
            fill
            sizes="100vw"
            unoptimized
          />
        )}

        {darkPreview && (
          <Image
            className="relative not-dark:hidden"
            loading="eager"
            quality={25}
            src={darkPreview}
            alt="Board preview image"
            fill
            sizes="100vw"
            unoptimized
          />
        )}

        {!lightPreview && !darkPreview && (
          <Image
            className="relative"
            loading="eager"
            quality={25}
            src={preview1}
            alt="Board preview image"
            fill
            sizes="100vw"
            unoptimized
          />
        )}
      </Link>
    </div>
  );
}
