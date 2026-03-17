"use client";

import { useTranslations } from "next-intl";

import { Label, Slider } from "@/shared/ui";

import { SidebarBlock } from "../SidebarBlock";

import { PropertiesRow } from "./PropertiesRow";
import {
  type PropertySectionProps,
  getCommonElementProperties,
} from "./shared";

export function AppearanceSection({ elements, update }: PropertySectionProps) {
  const t = useTranslations("toolbar.sidebar");

  const elementsOpacity = getCommonElementProperties(
    elements,
    "opacity",
    "mixed",
  );

  return (
    <SidebarBlock title={t("appearance")}>
      <PropertiesRow>
        <Label className="text-xs text-muted-foreground">{t("opacity")}</Label>
        <Slider
          value={elementsOpacity === "mixed" ? [0.5] : [elementsOpacity]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={(v) => update({ opacity: v[0] })}
          className="mx-2"
        />
        <span className="text-xs min-w-8 text-muted-foreground">
          {elementsOpacity === "mixed"
            ? "mixed"
            : `${Math.round((elementsOpacity as number) * 100)}%`}
        </span>
      </PropertiesRow>
    </SidebarBlock>
  );
}
