"use client";

import { useTranslations } from "next-intl";

import { NumberField } from "../NumberField";
import { SidebarBlock } from "../SidebarBlock";

import {
  type PropertySectionProps,
  getCommonElementProperties,
} from "./shared";

export function PositionSection({ elements, update }: PropertySectionProps) {
  const t = useTranslations("toolbar.sidebar");

  const elementsX = getCommonElementProperties(elements, "x", "mixed");
  const elementsY = getCommonElementProperties(elements, "y", "mixed");

  return (
    <SidebarBlock title={t("position")}>
      <div className="flex items-center gap-2">
        <NumberField
          label="x"
          value={elementsX}
          onChange={(v) => update({ x: v })}
        />
        <NumberField
          label="y"
          value={elementsY}
          onChange={(v) => update({ y: v })}
        />
      </div>
    </SidebarBlock>
  );
}
