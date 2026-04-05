"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/utils";

import { Spinner } from "@/shared/ui";

interface LoadingWorkspacesCarouselProps {
  className?: string;
}

export function LoadingWorkspacesCarousel({
  className,
}: LoadingWorkspacesCarouselProps) {
  const t = useTranslations();

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-lg text-muted-foreground",
        className,
      )}
    >
      <Spinner className="size-6" />
      {t("loading")}...
    </div>
  );
}
