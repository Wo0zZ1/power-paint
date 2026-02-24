"use client";

import { useTranslations } from "next-intl";

import { Spinner } from "@/shared/ui";
import { cn } from "@/utils";


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
