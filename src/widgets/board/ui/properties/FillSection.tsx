"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui";

import { isFillable } from "../../model/types";
import { ColorField } from "../ColorField";
import { NumberField } from "../NumberField";
import { SidebarBlock } from "../SidebarBlock";

import {
  type PropertySectionProps,
  getCommonElementProperties,
} from "./shared";

export function FillSection({ elements, update }: PropertySectionProps) {
  const t = useTranslations("toolbar.sidebar");

  const allElementsIsFillable = elements.every((el) => el && isFillable(el));
  if (!allElementsIsFillable) return null;

  const elementsFillType = getCommonElementProperties(
    elements,
    "fillType",
    "mixed",
  );
  const elementsFillColor1 = getCommonElementProperties(
    elements,
    "fillColor1",
    "#mixed",
  );
  const elementsFillColor2 = getCommonElementProperties(
    elements,
    "fillColor2",
    "#mixed",
  );
  const elementsFillGradientType = getCommonElementProperties(
    elements,
    "fillGradientType",
    "mixed",
  );
  const elementsFillAngle = getCommonElementProperties(
    elements,
    "fillAngle",
    "mixed",
  );

  return (
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
          exceptionValue="mixed"
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
                elementsFillGradientType === "linear" ? "default" : "outline"
              }
              style={{
                cursor:
                  elementsFillGradientType === "linear" ? "default" : "pointer",
                borderWidth: "1px",
              }}
              onClick={() => update({ fillGradientType: "linear" })}
            >
              {t("gradient_linear")}
            </Button>
            <Button
              size="sm"
              variant={
                elementsFillGradientType === "radial" ? "default" : "outline"
              }
              style={{
                cursor:
                  elementsFillGradientType === "radial" ? "default" : "pointer",
                borderWidth: "1px",
              }}
              onClick={() => update({ fillGradientType: "radial" })}
            >
              {t("gradient_radial")}
            </Button>
          </div>

          <ColorField
            preview
            exceptionValue="mixed"
            value={elementsFillColor1}
            onChange={(v) => update({ fillColor1: v })}
          />
          <ColorField
            preview
            exceptionValue="mixed"
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
  );
}
