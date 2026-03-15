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

import { FONT_OPTIONS } from "@/shared/constants";
import { Button, ButtonGroup, Label, Slider } from "@/shared/ui";

import { useThrottledCallback } from "../lib/useThrottledCallback";
import {
  hasSize,
  isFillable,
  isStrokable,
  isText,
  type ElementType,
} from "../model/types";
import { useBoardStore } from "../model/useBoardStore";

import { ColorField } from "./ColorField";
import { NumberField } from "./NumberField";
import { SelectField } from "./SelectField";
import { SidebarBlock } from "./SidebarBlock";

interface SingleElementPropertiesProps {
  element: ElementType;
}

export function SingleElementProperties({
  element,
}: SingleElementPropertiesProps) {
  const t = useTranslations("toolbar.sidebar");

  const updateElement = useBoardStore((s) => s.updateElement);

  const update = useThrottledCallback(
    <T extends ElementType>(change: Partial<T>) => {
      updateElement(element.id, change);
    },
  );

  return (
    <>
      <SidebarBlock title={t("position")}>
        <div className="flex items-center gap-2">
          <NumberField
            label="x"
            value={element.x}
            onChange={(v) => update({ x: v })}
          />
          <NumberField
            label="y"
            value={element.y}
            onChange={(v) => update({ y: v })}
          />
        </div>
      </SidebarBlock>

      <SidebarBlock title={t("size")}>
        {hasSize(element) && (
          <div className="flex items-center gap-2">
            <NumberField
              label="w"
              min={1}
              value={element.width}
              onChange={(v) => {
                update({ width: Math.max(1, v) });
              }}
            />
            <NumberField
              label="h"
              min={1}
              value={element.height}
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
            value={element.rotation}
            onChange={(v) => update({ rotation: v })}
          />
          <ButtonGroup>
            <Button
              onClick={() => update({ rotation: element.rotation - 45 })}
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
              onClick={() => update({ rotation: element.rotation + 45 })}
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
            value={[element.opacity]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={(v) => update({ opacity: v[0] })}
            className="mx-2"
          />
          <span className="text-xs text-muted-foreground">
            {Math.round(element.opacity * 100)}%
          </span>
        </div>
      </SidebarBlock>

      {isFillable(element) && (
        <SidebarBlock title={t("fill")}>
          <div className="flex *:[button]:flex-1! items-center gap-2">
            <Button
              size="sm"
              variant={element.fillType === null ? "default" : "outline"}
              onClick={() => update({ fillType: null })}
              style={{
                cursor: element.fillType === null ? "default" : "pointer",
                borderWidth: "1px",
              }}
            >
              {t("fill_none")}
            </Button>
            <Button
              size="sm"
              variant={element.fillType === "color" ? "default" : "outline"}
              onClick={() => update({ fillType: "color" })}
              style={{
                cursor: element.fillType === "color" ? "default" : "pointer",
                borderWidth: "1px",
              }}
            >
              {t("fill_solid")}
            </Button>
            <Button
              size="sm"
              variant={element.fillType === "gradient" ? "default" : "outline"}
              onClick={() => update({ fillType: "gradient" })}
              style={{
                cursor: element.fillType === "gradient" ? "default" : "pointer",
                borderWidth: "1px",
              }}
            >
              {t("fill_gradient")}
            </Button>
          </div>
          {element.fillType === "color" && (
            <ColorField
              preview
              value={element.fillColor1}
              onChange={(v) => update({ fillColor1: v })}
            />
          )}
          {element.fillType === "gradient" && (
            <>
              <div className="*:[button]:grow flex items-center gap-2">
                <Button
                  size="sm"
                  variant={
                    element.gradientType === "linear" ? "default" : "outline"
                  }
                  style={{
                    cursor:
                      element.gradientType === "linear" ? "default" : "pointer",
                    borderWidth: "1px",
                  }}
                  onClick={() => update({ gradientType: "linear" })}
                >
                  {t("gradient_linear")}
                </Button>
                <Button
                  size="sm"
                  variant={
                    element.gradientType === "radial" ? "default" : "outline"
                  }
                  style={{
                    cursor:
                      element.gradientType === "radial" ? "default" : "pointer",
                    borderWidth: "1px",
                  }}
                  onClick={() => update({ gradientType: "radial" })}
                >
                  {t("gradient_radial")}
                </Button>
              </div>

              <ColorField
                preview
                value={element.fillColor1}
                onChange={(v) => update({ fillColor1: v })}
              />
              <ColorField
                preview
                value={element.fillColor2}
                onChange={(v) => update({ fillColor2: v })}
              />

              {element.gradientType === "linear" && (
                <NumberField
                  label={t("gradient_angle")}
                  value={element.fillAngle}
                  onChange={(v) => update({ fillAngle: v })}
                />
              )}
            </>
          )}
        </SidebarBlock>
      )}

      {isStrokable(element) && (
        <SidebarBlock title={t("stroke")}>
          <div className="flex items-center gap-2">
            <NumberField
              label="w"
              min={element.type === "stroke" ? 1 : 0}
              max={100}
              value={element.strokeWidth}
              onChange={(v) => update({ strokeWidth: v })}
              className="w-full max-w-32"
            />

            <ColorField
              preview
              value={element.strokeColor}
              onChange={(v) => update({ strokeColor: v })}
              className="w-min"
            />
          </div>
          {element.type !== "stroke" && (
            <div className="flex *:[button]:flex-1! items-center gap-2">
              <Button
                size="sm"
                variant={element.strokeType === "solid" ? "default" : "outline"}
                onClick={() => update({ strokeType: "solid" })}
                style={{
                  cursor:
                    element.strokeType === "solid" ? "default" : "pointer",
                  borderWidth: "1px",
                }}
              >
                {t("stroke_solid")}
              </Button>
              <Button
                size="sm"
                variant={
                  element.strokeType === "dashed" ? "default" : "outline"
                }
                onClick={() => update({ strokeType: "dashed" })}
                style={{
                  cursor:
                    element.strokeType === "dashed" ? "default" : "pointer",
                  borderWidth: "1px",
                }}
              >
                {t("stroke_dashed")}
              </Button>
              <Button
                size="sm"
                variant={
                  element.strokeType === "dash_dotted" ? "default" : "outline"
                }
                onClick={() => update({ strokeType: "dash_dotted" })}
                style={{
                  cursor:
                    element.strokeType === "dash_dotted"
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

      {isText(element) && (
        <SidebarBlock title={t("text")}>
          <SelectField
            label={t("font")}
            value={element.fontFamily}
            onChange={(v) => update({ fontFamily: v })}
            placeholder="Font"
            options={FONT_OPTIONS}
          />

          <div className="flex items-center gap-2">
            <NumberField
              label="Size"
              min={8}
              max={200}
              value={element.fontSize}
              onChange={(v) => update({ fontSize: v })}
              className="w-full max-w-32"
            />
            <ColorField
              preview
              value={element.color}
              onChange={(v) => update({ color: v })}
              className="w-min"
            />
          </div>

          <div className="flex items-center gap-2 *:[button]:flex-1">
            <Button
              size="sm"
              variant={element.align === "left" ? "default" : "outline"}
              onClick={() => update({ align: "left" })}
              style={{ borderWidth: 1 }}
            >
              <AlignLeft className="size-4" />
            </Button>
            <Button
              size="sm"
              variant={element.align === "center" ? "default" : "outline"}
              onClick={() => update({ align: "center" })}
              style={{ borderWidth: 1 }}
            >
              <AlignCenter className="size-4" />
            </Button>
            <Button
              size="sm"
              variant={element.align === "right" ? "default" : "outline"}
              onClick={() => update({ align: "right" })}
              style={{ borderWidth: 1 }}
            >
              <AlignRight className="size-4" />
            </Button>
            <Button
              size="sm"
              variant={element.align === "justify" ? "default" : "outline"}
              onClick={() => update({ align: "justify" })}
              style={{ borderWidth: 1 }}
            >
              <AlignJustify className="size-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 *:[button]:flex-1">
            <Button
              size="sm"
              variant={element.verticalAlign === "top" ? "default" : "outline"}
              onClick={() => update({ verticalAlign: "top" })}
              style={{ borderWidth: 1 }}
            >
              Top
            </Button>
            <Button
              size="sm"
              variant={
                element.verticalAlign === "middle" ? "default" : "outline"
              }
              onClick={() => update({ verticalAlign: "middle" })}
              style={{ borderWidth: 1 }}
            >
              Middle
            </Button>
            <Button
              size="sm"
              variant={
                element.verticalAlign === "bottom" ? "default" : "outline"
              }
              onClick={() => update({ verticalAlign: "bottom" })}
              style={{ borderWidth: 1 }}
            >
              Bottom
            </Button>
          </div>
        </SidebarBlock>
      )}
    </>
  );
}
