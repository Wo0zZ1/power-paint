"use client";

import { useTranslations } from "next-intl";

import { Button, ColorInput, NumberField } from "@/shared/ui";

import type { PropertySectionProps } from "../../model";
import { isStrokable, isDraw, getCommonElementProperties } from "../../model";
import { SidebarBlock } from "../sidebar";

import { PropertiesRow } from "./PropertiesRow";

export function StrokeSection({ elements, update }: PropertySectionProps) {
  const t = useTranslations("toolbar.sidebar");

  const allElementsIsStrokable = elements.every((el) => el && isStrokable(el));
  if (!allElementsIsStrokable) return null;

  const someElementIsStroke = elements.some((el) => isDraw(el));

  const elementsStrokeWidth = getCommonElementProperties(
    elements,
    "strokeWidth",
    "mixed",
  );
  const elementsStrokeColor = getCommonElementProperties(
    elements,
    "strokeColor",
    "#mixed",
  );
  const elementsStrokeType = getCommonElementProperties(
    elements,
    "strokeType",
    "mixed",
  );

  return (
    <SidebarBlock title={t("stroke")}>
      <PropertiesRow className="overflow-visible">
        <NumberField
          label="w"
          min={someElementIsStroke ? 1 : 0}
          max={100}
          value={elementsStrokeWidth}
          onChange={(v) => update({ strokeWidth: v })}
          className="w-max max-w-20"
        />

        <ColorInput
          preview
          exceptionValues={["mixed"]}
          value={elementsStrokeColor}
          onChange={(v) => update({ strokeColor: v })}
          className="grow"
        />
      </PropertiesRow>
      {!someElementIsStroke && (
        <PropertiesRow className="overflow-x-auto overflow-y-hidden">
          <Button
            size="sm"
            variant={elementsStrokeType === "solid" ? "default" : "outline"}
            onClick={() => update({ strokeType: "solid" })}
            style={{
              cursor: elementsStrokeType === "solid" ? "default" : "pointer",
              borderWidth: "1px",
            }}
          >
            {t("stroke_solid")}
          </Button>
          <Button
            size="sm"
            variant={elementsStrokeType === "dashed" ? "default" : "outline"}
            onClick={() => update({ strokeType: "dashed" })}
            style={{
              cursor: elementsStrokeType === "dashed" ? "default" : "pointer",
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
                elementsStrokeType === "dash_dotted" ? "default" : "pointer",
              borderWidth: "1px",
            }}
          >
            {t("stroke_dash_dotted")}
          </Button>
        </PropertiesRow>
      )}
    </SidebarBlock>
  );
}
