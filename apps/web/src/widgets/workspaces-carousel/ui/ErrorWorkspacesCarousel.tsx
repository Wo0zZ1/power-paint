"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/utils";

interface ErrorWorkspacesCarouselProps {
  error: Error;
  className?: string;
}

export function ErrorWorkspacesCarousel({
  className,
  error,
}: ErrorWorkspacesCarouselProps) {
  const t = useTranslations();

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-lg text-destructive",
        className,
      )}
    >
      {t("error")}: {error.message}
    </div>
  );
}
