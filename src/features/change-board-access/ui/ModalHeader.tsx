"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/utils";

import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  TabsList,
  TabsTrigger,
} from "@/shared/ui";

interface ModalHeaderProps {
  className?: string;
}

export function ModalHeader({ className }: ModalHeaderProps) {
  const t = useTranslations("board.share");

  return (
    <DialogHeader className={cn("", className)}>
      <DialogTitle>{t("title")}</DialogTitle>

      <DialogDescription>{t("description")}</DialogDescription>

      <TabsList className="h-10! mt-2 w-full">
        <TabsTrigger value="share">{t("tabs.share")}</TabsTrigger>
        <TabsTrigger value="export">{t("tabs.export")}</TabsTrigger>
      </TabsList>
    </DialogHeader>
  );
}
