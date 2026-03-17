"use client";

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { TOOLTIP_DELAY } from "@/shared/config";
import { FONT_OPTIONS } from "@/shared/constants";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";

import { isText } from "../../model/types";
import { ColorField } from "../ColorField";
import { NumberField } from "../NumberField";
import { SelectField } from "../SelectField";
import { SidebarBlock } from "../SidebarBlock";

import { PropertiesRow } from "./PropertiesRow";
import {
  type PropertySectionProps,
  getCommonElementProperties,
} from "./shared";

export function TextSection({ elements, update }: PropertySectionProps) {
  const t = useTranslations("toolbar.sidebar");

  const allElementsIsText = elements.every((el) => el && isText(el));
  if (!allElementsIsText) return null;

  const elementsFontFamily = getCommonElementProperties(
    elements,
    "fontFamily",
    "mixed",
  );
  const elementsFontSize = getCommonElementProperties(
    elements,
    "fontSize",
    "mixed",
  );
  const elementsTextColor = getCommonElementProperties(
    elements,
    "textColor",
    "mixed",
  );
  const elementsTextAlign = getCommonElementProperties(
    elements,
    "textAlign",
    "mixed",
  );
  const elementsTextVerticalAlign = getCommonElementProperties(
    elements,
    "textVerticalAlign",
    "mixed",
  );

  return (
    <SidebarBlock title={t("text")}>
      <SelectField
        label={t("font")}
        value={elementsFontFamily}
        onChange={(v) => update({ fontFamily: v })}
        placeholder="Font"
        options={FONT_OPTIONS}
      />

      <PropertiesRow className="overflow-visible">
        <NumberField
          label="Size"
          min={8}
          max={200}
          value={elementsFontSize}
          onChange={(v) => update({ fontSize: v })}
          className="w-full max-w-32"
        />
        <ColorField
          preview
          value={elementsTextColor}
          onChange={(v) => update({ textColor: v })}
          className="w-min"
        />
      </PropertiesRow>

      <PropertiesRow>
        <Tooltip delayDuration={TOOLTIP_DELAY} disableHoverableContent>
          <TooltipTrigger asChild>
            <Button
              size="icon-sm"
              variant={elementsTextAlign === "left" ? "default" : "outline"}
              onClick={() => update({ textAlign: "left" })}
              style={{ borderWidth: 1 }}
            >
              <AlignLeft className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("align_left")}</TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={TOOLTIP_DELAY} disableHoverableContent>
          <TooltipTrigger asChild>
            <Button
              size="icon-sm"
              variant={elementsTextAlign === "center" ? "default" : "outline"}
              onClick={() => update({ textAlign: "center" })}
              style={{ borderWidth: 1 }}
            >
              <AlignCenter className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("align_center")}</TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={TOOLTIP_DELAY} disableHoverableContent>
          <TooltipTrigger asChild>
            <Button
              size="icon-sm"
              variant={elementsTextAlign === "right" ? "default" : "outline"}
              onClick={() => update({ textAlign: "right" })}
              style={{ borderWidth: 1 }}
            >
              <AlignRight className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("align_right")}</TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={TOOLTIP_DELAY} disableHoverableContent>
          <TooltipTrigger asChild>
            <Button
              size="icon-sm"
              variant={elementsTextAlign === "justify" ? "default" : "outline"}
              onClick={() => update({ textAlign: "justify" })}
              style={{ borderWidth: 1 }}
            >
              <AlignJustify className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("align_justify")}</TooltipContent>
        </Tooltip>
      </PropertiesRow>

      <PropertiesRow className="flex items-center *:[button]:flex-1 gap-2">
        <Tooltip delayDuration={TOOLTIP_DELAY} disableHoverableContent>
          <TooltipTrigger asChild>
            <Button
              size="icon-sm"
              variant={
                elementsTextVerticalAlign === "top" ? "default" : "outline"
              }
              onClick={() => update({ textVerticalAlign: "top" })}
              style={{ borderWidth: 1 }}
            >
              <AlignVerticalJustifyStart />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("align_top")}</TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={TOOLTIP_DELAY} disableHoverableContent>
          <TooltipTrigger asChild>
            <Button
              size="icon-sm"
              variant={
                elementsTextVerticalAlign === "middle" ? "default" : "outline"
              }
              onClick={() => update({ textVerticalAlign: "middle" })}
              style={{ borderWidth: 1 }}
            >
              <AlignVerticalJustifyCenter />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("align_middle")}</TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={TOOLTIP_DELAY} disableHoverableContent>
          <TooltipTrigger asChild>
            <Button
              size="icon-sm"
              variant={
                elementsTextVerticalAlign === "bottom" ? "default" : "outline"
              }
              onClick={() => update({ textVerticalAlign: "bottom" })}
              style={{ borderWidth: 1 }}
            >
              <AlignVerticalJustifyEnd />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("align_bottom")}</TooltipContent>
        </Tooltip>
      </PropertiesRow>
    </SidebarBlock>
  );
}
