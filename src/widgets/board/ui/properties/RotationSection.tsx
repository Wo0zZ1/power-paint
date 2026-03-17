"use client";

import { RotateCcw, RotateCw } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button, ButtonGroup } from "@/shared/ui";

import { NumberField } from "../NumberField";
import { SidebarBlock } from "../SidebarBlock";

import { PropertiesRow } from "./PropertiesRow";
import {
  type PropertySectionProps,
  getCommonElementProperties,
} from "./shared";

export function RotationSection({ elements, update }: PropertySectionProps) {
  const t = useTranslations("toolbar.sidebar");

  const elementsRotation = getCommonElementProperties(
    elements,
    "rotation",
    "mixed",
  );

  return (
    <SidebarBlock title={t("rotation")}>
      <PropertiesRow>
        <NumberField
          label={"°"}
          value={elementsRotation}
          modulo={360}
          onChange={(v) => update({ rotation: v })}
        />
        <ButtonGroup>
          <Button
            onClick={() => update((prev) => ({ rotation: prev.rotation - 45 }))}
            variant="outline"
            size="icon-sm"
          >
            <RotateCcw className="size-4" />
          </Button>
          <Button
            onClick={() => update({ rotation: 0 })}
            variant="outline"
            size="sm"
          >
            {t("reset")}
          </Button>
          <Button
            onClick={() => update((prev) => ({ rotation: prev.rotation + 45 }))}
            variant="outline"
            size="icon-sm"
          >
            <RotateCw className="size-4" />
          </Button>
        </ButtonGroup>
      </PropertiesRow>
    </SidebarBlock>
  );
}
