"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { cn } from "@/shared/lib/utils";
import {
  Separator,
} from "@/shared/ui";

import { useBoardStore } from "../model/useBoardStore";

import { BackgroundSection } from "./BackgroundSection";
import { MultiElementProperties } from "./MultiElementProperties";
import { SidebarBlock } from "./SidebarBlock";
import { SingleElementProperties } from "./SingleElementProperties";

export interface LeftSidebarProps {
  className?: string;
}

export function LeftSidebar({ className }: LeftSidebarProps) {
  const t = useTranslations("toolbar.sidebar");

  const selectedIds = useBoardStore(useShallow((s) => s.selectedIds));
  const elements = useBoardStore(useShallow((s) => s.elements));

  const selectedElement = useMemo(() => {
    if (selectedIds.size !== 1) return null;
    const id = selectedIds.values().next().value as string;
    return elements.get(id) ?? null;
  }, [selectedIds, elements]);

  return (
    <div
      className={cn(
        className,
        "space-y-2 w-72 p-3 border rounded-lg bg-secondary/85 backdrop-blur-sm overflow-y-auto",
      )}
    >
      <SidebarBlock title={t("backgroundColor")}>
        <BackgroundSection />
      </SidebarBlock>

      {selectedElement && (
        <>
          <Separator />
          <SingleElementProperties element={selectedElement} />
        </>
      )}

      {selectedIds.size > 1 && (
        <>
          <Separator />
          <MultiElementProperties ids={selectedIds} />
        </>
      )}
    </div>
  );
}
