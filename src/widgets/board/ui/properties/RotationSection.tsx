"use client";

import { RotateCcw, RotateCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

import { TOOLTIP_DELAY } from "@/shared/constants";
import {
  Button,
  ButtonGroup,
  NumberField,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui";

import type { PropertySectionProps } from "../../model";
import {
  getCommonElementProperties,
  rotateElementAroundCenter,
} from "../../model";
import { SidebarBlock } from "../sidebar";

import { PropertiesRow } from "./PropertiesRow";

export function RotationSection({ elements, update }: PropertySectionProps) {
  const t = useTranslations("toolbar.sidebar");

  const elementsRotation = getCommonElementProperties(
    elements,
    "rotation",
    "mixed",
  );

  const handleRotate = useCallback(
    (rotation: number = 0) => {
      update((prev) => rotateElementAroundCenter(prev, rotation));
    },
    [update],
  );

  const handleRotateDiff = useCallback(
    (rotationDiff: number = 0) => {
      update((prev) =>
        rotateElementAroundCenter(prev, prev.rotation + rotationDiff),
      );
    },
    [update],
  );

  if (elements.length > 1) return null;

  return (
    <SidebarBlock title={t("rotation")}>
      <PropertiesRow>
        <NumberField
          label={"°"}
          value={elementsRotation}
          modulo={360}
          onChange={handleRotate}
        />
        <ButtonGroup>
          <Tooltip delayDuration={TOOLTIP_DELAY} disableHoverableContent>
            <TooltipTrigger asChild>
              <Button
                onClick={() => handleRotateDiff(-45)}
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
                onClick={() => handleRotate(0)}
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
                onClick={() => handleRotateDiff(45)}
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
