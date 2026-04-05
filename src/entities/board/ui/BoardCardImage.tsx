"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import preview from "@/public/assets/preview1.jpeg";
import { ROUTES } from "@/shared/config";
import { getSystemTheme, useTheme } from "@/shared/lib/theme";
import { cn } from "@/utils";

interface BoardCardImageProps {
  className?: string;
  boardId: string;
}

export function BoardCardImage({ className, boardId }: BoardCardImageProps) {
  const [imageUrl, setImageUrl] = useState<string>(preview.src);
  const { themePreference } = useTheme();

  useEffect(() => {
    console.log("Image useEffect");

    const targetTheme =
      themePreference === "system" ? getSystemTheme() : themePreference;

    if (targetTheme === "light") {
      setImageUrl(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/boards/${boardId}/preview?theme=light`,
      );
    } else {
      setImageUrl(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/boards/${boardId}/preview?theme=dark`,
      );
    }
  }, [themePreference, boardId]);

  const handleImageError = () => {
    setImageUrl(preview.src);
  };

  return (
    <div className={cn("", className)}>
      <Link
        className="relative w-full h-full block aspect-video"
        href={ROUTES.BOARD(boardId)}
      >
        <Image
          fill
          quality={75}
          sizes="100%"
          loading="lazy"
          src={imageUrl}
          placeholder="blur"
          blurDataURL={preview.src}
          alt="Board preview image"
          onError={handleImageError}
        />
      </Link>
    </div>
  );
}
