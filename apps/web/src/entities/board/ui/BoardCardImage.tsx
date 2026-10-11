"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/utils";

import { ROUTES } from "@/shared/config";
import { getSystemTheme, useTheme } from "@/shared/lib/theme";
import { Skeleton } from "@/shared/ui";

interface BoardCardImageProps {
  className?: string;
  boardId: string;
  updatedAt: Date | string;
}

export function BoardCardImage({
  className,
  boardId,
  updatedAt,
}: BoardCardImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const previousUrlRef = useRef<string | null>(null);

  const { themePreference } = useTheme();

  useEffect(() => {
    const targetTheme =
      themePreference === "system" ? getSystemTheme() : themePreference;

    const cacheBuster = `&v=${new Date(updatedAt).getTime()}`;

    const newUrl =
      targetTheme === "light"
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/boards/${boardId}/preview?theme=light${cacheBuster}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/api/boards/${boardId}/preview?theme=dark${cacheBuster}`;

    if (newUrl === previousUrlRef.current) return;

    setIsImageLoaded(false);
    setImageUrl(newUrl);
    previousUrlRef.current = newUrl;
  }, [themePreference, boardId, updatedAt]);

  return (
    <div className={cn("", className)}>
      <Link
        className="relative w-full h-full block aspect-video overflow-hidden"
        href={ROUTES.BOARD(boardId)}
      >
        <Skeleton className="absolute inset-0 rounded-none" />

        {/* Картинка есть всегда: доску без снимка сервер отдаёт заглушкой */}
        {imageUrl && (
          <Image
            fill
            sizes="100%"
            loading="lazy"
            src={imageUrl}
            alt="Board preview image"
            unoptimized={true}
            onLoad={() => setIsImageLoaded(true)}
            className={cn(
              "object-cover opacity-0 transition-opacity duration-500",
              {
                "opacity-100": isImageLoaded,
              },
            )}
          />
        )}
      </Link>
    </div>
  );
}
