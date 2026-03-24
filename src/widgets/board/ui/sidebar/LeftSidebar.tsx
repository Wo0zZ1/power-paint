"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/shared/lib/utils";

import { BackgroundSection } from "./BackgroundSection";
import { ElementProperties } from "./ElementProperties";
import { SidebarBlock } from "./SidebarBlock";

export interface LeftSidebarProps {
  className?: string;
}

export function LeftSidebar({ className }: LeftSidebarProps) {
  const t = useTranslations("toolbar.sidebar");

  return (
    <div
      className={cn(
        className,
        "space-y-2 w-74 p-3 border rounded-lg bg-secondary/85 backdrop-blur-sm overflow-y-auto",
      )}
    >
      <SidebarBlock title={t("backgroundColor")}>
        <BackgroundSection />
      </SidebarBlock>

      <ElementProperties />
    </div>
  );
}
