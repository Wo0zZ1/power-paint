"use client";

import { useTranslations } from "next-intl";

import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  TabsList,
  TabsTrigger,
} from "@/shared/ui";
import { cn } from "@/utils";

interface ModalHeaderProps {
  className?: string;
}

export function ModalHeader({ className }: ModalHeaderProps) {
  const t = useTranslations();

  return (
    <DialogHeader className={cn("", className)}>
      <DialogTitle>{t("workspace.share.title")}</DialogTitle>

      <DialogDescription>{t("workspace.share.description")}</DialogDescription>

      <TabsList className="h-10! mt-2 w-full">
        <TabsTrigger value="share">
          {t("workspace.share.tabs.share")}
        </TabsTrigger>
        <TabsTrigger value="export">
          {t("workspace.share.tabs.export")}
        </TabsTrigger>
      </TabsList>
    </DialogHeader>
  );
}
