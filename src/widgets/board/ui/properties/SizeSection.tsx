"use client";

import { useTranslations } from "next-intl";

import { hasSize } from "../../model/types";
import { NumberField } from "../NumberField";
import { SidebarBlock } from "../SidebarBlock";

import { PropertiesRow } from "./PropertiesRow";
import {
  type PropertySectionProps,
  getCommonElementProperties,
} from "./shared";

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
          onChange={(v) => update({ width: Math.max(1, v) })}
        />
        <NumberField
          label="h"
          min={1}
          value={elementsHeight}
          onChange={(v) => update({ height: Math.max(1, v) })}
        />
      </PropertiesRow>
    </SidebarBlock>
  );
}
