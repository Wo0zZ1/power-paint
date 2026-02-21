"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/utils";

interface ErrorWorkspaceGridProps {
  error: Error;
  className?: string;
}

export function ErrorWorkspaceGrid({
  error,
  className,
}: ErrorWorkspaceGridProps) {
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
