"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/utils";

import { DialogHeader, DialogTitle, DialogDescription } from "@/shared/ui";

interface ModalHeaderProps {
  className?: string;
}

export function ModalHeader({ className }: ModalHeaderProps) {
  const t = useTranslations("workspace.share");

  return (
    <DialogHeader className={cn("", className)}>
      <DialogTitle>{t("title")}</DialogTitle>

      <DialogDescription>{t("description")}</DialogDescription>
    </DialogHeader>
  );
}
