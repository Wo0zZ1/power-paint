"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/utils";

import { Spinner } from "@/shared/ui";


interface LoadingWorkspaceGridProps {
  className?: string;
}

export function LoadingWorkspaceGrid({ className }: LoadingWorkspaceGridProps) {
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
