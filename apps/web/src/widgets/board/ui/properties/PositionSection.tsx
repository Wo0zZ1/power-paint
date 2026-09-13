"use client";

import { useTranslations } from "next-intl";

import { NumberField } from "@/shared/ui";

import type { PropertySectionProps } from "../../model";
import { getCommonElementProperties } from "../../model";
import { SidebarBlock } from "../sidebar";

import { PropertiesRow } from "./PropertiesRow";

export function PositionSection({ elements, update }: PropertySectionProps) {
  const t = useTranslations("toolbar.sidebar");

  const elementsX = getCommonElementProperties(elements, "x", "mixed");
  const elementsY = getCommonElementProperties(elements, "y", "mixed");

  return (
    <SidebarBlock title={t("position")}>
      <PropertiesRow>
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
      </PropertiesRow>
    </SidebarBlock>
  );
}
