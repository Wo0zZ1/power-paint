"use client";

import { useTranslations } from "next-intl";

import { NumberField } from "@/shared/ui";

import type { PropertySectionProps } from "../../model";
import { hasSize, getCommonElementProperties } from "../../model";
import { SidebarBlock } from "../sidebar";

import { PropertiesRow } from "./PropertiesRow";

export function SizeSection({ elements, update }: PropertySectionProps) {
  const t = useTranslations("toolbar.sidebar");

  const allElementsHasSize = elements.every((el) => el && hasSize(el));
  if (!allElementsHasSize) return null;

  const elementsWidth = getCommonElementProperties(elements, "width", "mixed");
  const elementsHeight = getCommonElementProperties(
    elements,
    "height",
    "mixed",
  );

  return (
    <SidebarBlock title={t("size")}>
      <PropertiesRow>
        <NumberField
          label="w"
          min={1}
          value={elementsWidth}
          name="width"
          id="input-width"
          onChange={(v) => update({ width: Math.max(1, v) })}
        />
        <NumberField
          label="h"
          min={1}
          value={elementsHeight}
          name="height"
          id="input-height"
          onChange={(v) => update({ height: Math.max(1, v) })}
        />
      </PropertiesRow>
    </SidebarBlock>
  );
}
