"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui";

import { isStrokable, isStroke } from "../../model/types";
import { ColorField } from "../ColorField";
import { NumberField } from "../NumberField";
import { SidebarBlock } from "../SidebarBlock";

import {
  type PropertySectionProps,
  getCommonElementProperties,
} from "./shared";

export function StrokeSection({ elements, update }: PropertySectionProps) {
  const t = useTranslations("toolbar.sidebar");

  const allElementsIsStrokable = elements.every((el) => el && isStrokable(el));
  if (!allElementsIsStrokable) return null;

  const someElementIsStroke = elements.some((el) => isStroke(el));

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
          exceptionValue="mixed"
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
        </div>
      )}
    </SidebarBlock>
  );
}
