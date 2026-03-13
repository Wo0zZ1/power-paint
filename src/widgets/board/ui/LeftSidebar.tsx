"use client";

import { SquarePlus, CirclePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { cn } from "@/shared/lib/utils";
import {
  Button,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui";

import { useAddElement } from "../model/useAddElement";
import { useBoardStore } from "../model/useBoardStore";

import { BackgroundSection } from "./BackgroundSection";
import { MultiElementProperties } from "./MultiElementProperties";
import { SidebarBlock } from "./SidebarBlock";
import { SingleElementProperties } from "./SingleElementProperties";

function AddElementsSection() {
  const t = useTranslations("toolbar.sidebar");
  const { addRect, addCircle } = useAddElement();

  return (
    <div className="flex gap-1.5">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={addRect}
          >
            <SquarePlus className="size-4" />
            {t("addRect")}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{t("addRect")}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={addCircle}
          >
            <CirclePlus className="size-4" />
            {t("addCircle")}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{t("addCircle")}</TooltipContent>
      </Tooltip>
    </div>
  );
}

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

      <Separator />
      <AddElementsSection />

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
