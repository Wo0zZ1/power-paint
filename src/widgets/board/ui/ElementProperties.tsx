"use client";

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useShallow } from "zustand/react/shallow";

import { FONT_OPTIONS } from "@/shared/constants";
import { Button, ButtonGroup, Label, Separator, Slider } from "@/shared/ui";

import { useThrottledCallback } from "../lib/useThrottledCallback";
import type { BaseElementType, ElementType } from "../model/types";
import {
  hasSize,
  isFillable,
  isStrokable,
  isStroke,
  isText,
} from "../model/types";
import { useBoardStore } from "../model/useBoardStore";

import { ColorField } from "./ColorField";
import { NumberField } from "./NumberField";
import { SelectField } from "./SelectField";
import { SidebarBlock } from "./SidebarBlock";

interface SingleElementPropertiesProps {}

function getCommonElementProperties<
  T extends BaseElementType,
  K extends keyof T,
  F,
>(elements: T[], property: K, fallback: F = "mixed" as F): T[K] | F {
  const values = elements.map((el) => el[property]);
  const uniqueValues = new Set(values);
  return uniqueValues.size === 1 ? values[0] : fallback;
}

export function ElementProperties({}: SingleElementPropertiesProps) {
  const t = useTranslations("toolbar.sidebar");

  const selectedElementIds = useBoardStore(useShallow((s) => s.selectedIds));
  const elements = useBoardStore(useShallow((s) => s.elements));

  const selectedElements = Array.from(selectedElementIds)
    .map((id) => elements.get(id))
    .filter((el) => el !== undefined);

  const updateElements = useBoardStore((s) => s.updateElements);

  const update = useThrottledCallback(
    <T extends ElementType>(change: Partial<T> | ((prev: T) => Partial<T>)) => {
      const changes = new Map<string, Partial<ElementType>>();

      for (const element of selectedElements) {
        changes.set(
          element.id,
          change instanceof Function ? change(element as T) : change,
        );
      }

      updateElements(changes);
    },
  );

  const allElementsHasSize = selectedElements.every((el) => el && hasSize(el));
  const allElementsIsFillable = selectedElements.every(
    (el) => el && isFillable(el),
  );
  const allElementsIsStrokable = selectedElements.every(
    (el) => el && isStrokable(el),
  );
  const allElementsIsText = selectedElements.every((el) => el && isText(el));
  const someElementIsStroke = selectedElements.some((el) => isStroke(el));

  if (selectedElementIds.size === 0) return null;

  const elementsX = getCommonElementProperties(selectedElements, "x", "mixed");
  const elementsY = getCommonElementProperties(selectedElements, "y", "mixed");
  const elementsOpacity = getCommonElementProperties(
    selectedElements,
    "opacity",
    "mixed",
  );

  const elementsWidth = allElementsHasSize
    ? getCommonElementProperties(selectedElements, "width", "mixed")
    : "mixed";
  const elementsHeight = allElementsHasSize
    ? getCommonElementProperties(selectedElements, "height", "mixed")
    : "mixed";

  const elementsRotation = getCommonElementProperties(
    selectedElements,
    "rotation",
    "mixed",
  );

  const elementsFillType = allElementsIsFillable
    ? getCommonElementProperties(selectedElements, "fillType", "mixed")
    : "mixed";
  const elementsFillColor1 = allElementsIsFillable
    ? getCommonElementProperties(selectedElements, "fillColor1", "mixed")
    : "mixed";
  const elementsFillColor2 = allElementsIsFillable
    ? getCommonElementProperties(selectedElements, "fillColor2", "mixed")
    : "mixed";
  const elementsFillGradientType = allElementsIsFillable
    ? getCommonElementProperties(selectedElements, "fillGradientType", "mixed")
    : "mixed";
  const elementsFillAngle = allElementsIsFillable
    ? getCommonElementProperties(selectedElements, "fillAngle", "mixed")
    : "mixed";

  const elementsStrokeWidth = allElementsIsStrokable
    ? getCommonElementProperties(selectedElements, "strokeWidth", "mixed")
    : "mixed";
  const elementsStrokeColor = allElementsIsStrokable
    ? getCommonElementProperties(selectedElements, "strokeColor", "mixed")
    : "mixed";
  const elementsStrokeType = allElementsIsStrokable
    ? getCommonElementProperties(selectedElements, "strokeType", "mixed")
    : "mixed";

  const elementsFontFamily = allElementsIsText
    ? getCommonElementProperties(selectedElements, "fontFamily", "mixed")
    : "mixed";
  const elementsFontSize = allElementsIsText
    ? getCommonElementProperties(selectedElements, "fontSize", "mixed")
    : "mixed";
  const elementsTextColor = allElementsIsText
    ? getCommonElementProperties(selectedElements, "textColor", "mixed")
    : "mixed";
  const elementsTextAlign = allElementsIsText
    ? getCommonElementProperties(selectedElements, "textAlign", "mixed")
    : "mixed";
  const elementsTextVerticalAlign = allElementsIsText
    ? getCommonElementProperties(selectedElements, "textVerticalAlign", "mixed")
    : "mixed";

  return (
    <>
      <Separator />

      <SidebarBlock title={t("position")}>
        <div className="flex items-center gap-2">
          <NumberField
            label="x"
            value={elementsX}
            onChange={(v) => {
              console.log("x:", v);
              update({ x: v });
            }}
          />
          <NumberField
            label="y"
            value={elementsY}
            onChange={(v) => update({ y: v })}
          />
        </div>
      </SidebarBlock>

      <SidebarBlock title={t("size")}>
        {allElementsHasSize && (
          <div className="flex items-center gap-2">
            <NumberField
              label="w"
              min={1}
              value={elementsWidth}
              onChange={(v) => {
                update({ width: Math.max(1, v) });
              }}
            />
            <NumberField
              label="h"
              min={1}
              value={elementsHeight}
              onChange={(v) => {
                update({ height: Math.max(1, v) });
              }}
            />
          </div>
        )}
      </SidebarBlock>

      <SidebarBlock title={t("rotation")}>
        <div className="flex items-center gap-2">
          <NumberField
            label={"°"}
            value={elementsRotation}
            modulo={360}
            onChange={(v) => update({ rotation: v })}
          />
          <ButtonGroup>
            <Button
              onClick={() =>
                update((prev) => ({ rotation: prev.rotation - 45 }))
              }
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
              onClick={() =>
                update((prev) => ({ rotation: prev.rotation + 45 }))
              }
              variant="outline"
              size="icon-sm"
            >
              <RotateCw className="size-4" />
            </Button>
          </ButtonGroup>
        </div>
      </SidebarBlock>

      <SidebarBlock title={t("appearance")}>
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">
            {t("opacity")}
          </Label>
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
              : `${Math.round(elementsOpacity * 100)}%`}
          </span>
        </div>
      </SidebarBlock>

      {allElementsIsFillable && (
        <SidebarBlock title={t("fill")}>
          <div className="flex *:[button]:flex-1 items-center gap-2">
            <Button
              size="sm"
              variant={elementsFillType === "none" ? "default" : "outline"}
              onClick={() => update({ fillType: "none" })}
              style={{
                cursor: elementsFillType === "none" ? "default" : "pointer",
                borderWidth: "1px",
              }}
            >
              {t("fill_none")}
            </Button>
            <Button
              size="sm"
              variant={elementsFillType === "color" ? "default" : "outline"}
              onClick={() => update({ fillType: "color" })}
              style={{
                cursor: elementsFillType === "color" ? "default" : "pointer",
                borderWidth: "1px",
              }}
            >
              {t("fill_solid")}
            </Button>
            <Button
              size="sm"
              variant={elementsFillType === "gradient" ? "default" : "outline"}
              onClick={() => update({ fillType: "gradient" })}
              style={{
                cursor: elementsFillType === "gradient" ? "default" : "pointer",
                borderWidth: "1px",
              }}
            >
              {t("fill_gradient")}
            </Button>
          </div>
          {elementsFillType === "color" && (
            <ColorField
              preview
              value={elementsFillColor1}
              onChange={(v) => update({ fillColor1: v })}
            />
          )}
          {elementsFillType === "gradient" && (
            <>
              <div className="flex *:[button]:flex-1 items-center gap-2">
                <Button
                  size="sm"
                  variant={
                    elementsFillGradientType === "linear"
                      ? "default"
                      : "outline"
                  }
                  style={{
                    cursor:
                      elementsFillGradientType === "linear"
                        ? "default"
                        : "pointer",
                    borderWidth: "1px",
                  }}
                  onClick={() => update({ fillGradientType: "linear" })}
                >
                  {t("gradient_linear")}
                </Button>
                <Button
                  size="sm"
                  variant={
                    elementsFillGradientType === "radial"
                      ? "default"
                      : "outline"
                  }
                  style={{
                    cursor:
                      elementsFillGradientType === "radial"
                        ? "default"
                        : "pointer",
                    borderWidth: "1px",
                  }}
                  onClick={() => update({ fillGradientType: "radial" })}
                >
                  {t("gradient_radial")}
                </Button>
              </div>

              <ColorField
                preview
                value={elementsFillColor1}
                onChange={(v) => update({ fillColor1: v })}
              />
              <ColorField
                preview
                value={elementsFillColor2}
                onChange={(v) => update({ fillColor2: v })}
              />

              {elementsFillGradientType === "linear" && (
                <NumberField
                  label={t("gradient_angle")}
                  value={elementsFillAngle}
                  modulo={360}
                  onChange={(v) => update({ fillAngle: v })}
                />
              )}
            </>
          )}
        </SidebarBlock>
      )}

      {allElementsIsStrokable && (
        <SidebarBlock title={t("stroke")}>
          <div className="flex items-center gap-2">
            <NumberField
              label="w"
              min={someElementIsStroke ? 1 : 0}
              max={100}
              value={elementsStrokeWidth}
              onChange={(v) => update({ strokeWidth: v })}
              className="w-full max-w-32"
            />

            <ColorField
              preview
              value={elementsStrokeColor}
              onChange={(v) => update({ strokeColor: v })}
              className="w-min"
            />
          </div>
          {!someElementIsStroke && (
            <div className="flex *:[button]:flex-1 items-center gap-2 max-w-full overflow-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-thumb]:hover:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full">
              <Button
                size="sm"
                variant={elementsStrokeType === "solid" ? "default" : "outline"}
                onClick={() => update({ strokeType: "solid" })}
                style={{
                  cursor:
                    elementsStrokeType === "solid" ? "default" : "pointer",
                  borderWidth: "1px",
                }}
              >
                {t("stroke_solid")}
              </Button>
              <Button
                size="sm"
                variant={
                  elementsStrokeType === "dashed" ? "default" : "outline"
                }
                onClick={() => update({ strokeType: "dashed" })}
                style={{
                  cursor:
                    elementsStrokeType === "dashed" ? "default" : "pointer",
                  borderWidth: "1px",
                }}
              >
                {t("stroke_dashed")}
              </Button>
              <Button
                size="sm"
                variant={
                  elementsStrokeType === "dash_dotted" ? "default" : "outline"
                }
                onClick={() => update({ strokeType: "dash_dotted" })}
                style={{
                  cursor:
                    elementsStrokeType === "dash_dotted"
                      ? "default"
                      : "pointer",
                  borderWidth: "1px",
                }}
              >
                {t("stroke_dash_dotted")}
              </Button>
            </div>
          )}
        </SidebarBlock>
      )}

      {allElementsIsText && (
        <SidebarBlock title={t("text")}>
          <SelectField
            label={t("font")}
            value={elementsFontFamily}
            onChange={(v) => update({ fontFamily: v })}
            placeholder="Font"
            options={FONT_OPTIONS}
          />

          <div className="flex items-center gap-2">
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
          </div>

          <div className="flex items-center gap-2 *:[button]:flex-1">
            <Button
              size="sm"
              variant={elementsTextAlign === "left" ? "default" : "outline"}
              onClick={() => update({ textAlign: "left" })}
              style={{ borderWidth: 1 }}
            >
              <AlignLeft className="size-4" />
            </Button>
            <Button
              size="sm"
              variant={elementsTextAlign === "center" ? "default" : "outline"}
              onClick={() => update({ textAlign: "center" })}
              style={{ borderWidth: 1 }}
            >
              <AlignCenter className="size-4" />
            </Button>
            <Button
              size="sm"
              variant={elementsTextAlign === "right" ? "default" : "outline"}
              onClick={() => update({ textAlign: "right" })}
              style={{ borderWidth: 1 }}
            >
              <AlignRight className="size-4" />
            </Button>
            <Button
              size="sm"
              variant={elementsTextAlign === "justify" ? "default" : "outline"}
              onClick={() => update({ textAlign: "justify" })}
              style={{ borderWidth: 1 }}
            >
              <AlignJustify className="size-4" />
            </Button>
          </div>

          <div className="flex items-center *:[button]:flex-1 gap-2">
            <Button
              size="sm"
              variant={
                elementsTextVerticalAlign === "top" ? "default" : "outline"
              }
              onClick={() => update({ textVerticalAlign: "top" })}
              style={{ borderWidth: 1 }}
            >
              {t("align_top")}
            </Button>
            <Button
              size="sm"
              variant={
                elementsTextVerticalAlign === "middle" ? "default" : "outline"
              }
              onClick={() => update({ textVerticalAlign: "middle" })}
              style={{ borderWidth: 1 }}
            >
              {t("align_middle")}
            </Button>
            <Button
              size="sm"
              variant={
                elementsTextVerticalAlign === "bottom" ? "default" : "outline"
              }
              onClick={() => update({ textVerticalAlign: "bottom" })}
              style={{ borderWidth: 1 }}
            >
              {t("align_bottom")}
            </Button>
          </div>
        </SidebarBlock>
      )}
    </>
  );
}
