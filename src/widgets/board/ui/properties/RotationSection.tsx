"use client";

import { RotateCcw, RotateCw } from "lucide-react";
import { useTranslations } from "next-intl";

import { TOOLTIP_DELAY } from "@/shared/config";
import {
  Button,
  ButtonGroup,
  NumberField,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui";

import type { PropertySectionProps } from "../../model";
import { getCommonElementProperties } from "../../model";
import { SidebarBlock } from "../sidebar";

import { PropertiesRow } from "./PropertiesRow";

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
          <Tooltip delayDuration={TOOLTIP_DELAY} disableHoverableContent>
            <TooltipTrigger asChild>
              <Button
                onClick={() =>
                  update((prev) => ({ rotation: prev.rotation - 45 }))
                }
                variant="outline"
                size="icon-sm"
              >
                <RotateCcw className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("rotation_ccw")}</TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={TOOLTIP_DELAY} disableHoverableContent>
            <TooltipTrigger asChild>
              <Button
                onClick={() => update({ rotation: 0 })}
                variant="outline"
                size="sm"
              >
                {t("rotation_reset")}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("rotation_reset_tooltip")}</TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={TOOLTIP_DELAY} disableHoverableContent>
            <TooltipTrigger asChild>
              <Button
                onClick={() =>
                  update((prev) => ({ rotation: prev.rotation + 45 }))
                }
                variant="outline"
                size="icon-sm"
              >
                <RotateCw className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("rotation_cw")}</TooltipContent>
          </Tooltip>
        </ButtonGroup>
      </PropertiesRow>
    </SidebarBlock>
  );
}
