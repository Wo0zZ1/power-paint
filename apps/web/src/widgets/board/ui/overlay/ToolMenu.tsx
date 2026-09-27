"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/utils";

import {
  Button,
  ColorInput,
  ColorSwatch,
  NumberField,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Switch,
} from "@/shared/ui";

import { useToolMenu } from "@/widgets/board/model";

import { PropertiesRow } from "../properties";
import { SidebarBlock } from "../sidebar";

export interface ToolMenuProps {
  className?: string;
}

export function ToolMenu({ className }: ToolMenuProps) {
  const t = useTranslations("toolbar.sidebar");

  const {
    currentFillColor,
    currentFillEnabled,
    currentStrokeColor,
    currentStrokeColorInverted,
    currentStrokeWidth,
    setCurrentFillColor,
    setCurrentFillEnabled,
    setCurrentStrokeColor,
    setCurrentStrokeWidth,
    shouldShowFillButton,
    shouldShowStrokeButton,
    strokePreviewWidth,
  } = useToolMenu();

  if (!shouldShowFillButton && !shouldShowStrokeButton) return null;

  return (
    <div
      className={cn(
        "flex gap-1 rounded-lg border bg-secondary/85 backdrop-blur-sm shadow-md",
        "before:content-[''] before:-z-1 before:rounded-lg before:absolute before:inset-0 before:bg-primary/0",
        className,
      )}
    >
      {shouldShowStrokeButton && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              aria-label={t("stroke")}
              className="w-12"
            >
              <svg
                viewBox="0 0 24 24"
                preserveAspectRatio="none"
                fill="none"
                stroke={currentStrokeColorInverted}
                strokeWidth={strokePreviewWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="w-full! h-full!"
              >
                <path d="M 3 12 L 5 12 C 12 5 12 19 18 12 L 20 12" />
              </svg>
            </Button>
          </PopoverTrigger>

          <PopoverContent side="top" align="center" sideOffset={10}>
            <SidebarBlock title={t("stroke")}>
              <PropertiesRow className="overflow-visible">
                <NumberField
                  label="w"
                  min={0}
                  max={100}
                  step={1}
                  value={currentStrokeWidth}
                  onChange={(v) => setCurrentStrokeWidth(v)}
                  className="w-max max-w-20"
                />

                <ColorInput
                  preview
                  exceptionValues={["mixed"]}
                  value={currentStrokeColor}
                  onChange={(v) => setCurrentStrokeColor(v)}
                  className="grow"
                />
              </PropertiesRow>
            </SidebarBlock>
          </PopoverContent>
        </Popover>
      )}

      {shouldShowFillButton && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              aria-label={t("fill")}
              className="shrink-0 gap-2 px-2"
            >
              <div className="border rounded-full">
                <ColorSwatch
                  className="size-4 rounded-full"
                  color={currentFillColor}
                  opacity={currentFillEnabled ? 1 : 0}
                  invertable
                />
              </div>
              <span className="text-xs font-medium">{t("fill")}</span>
            </Button>
          </PopoverTrigger>

          <PopoverContent side="top" align="center" sideOffset={10}>
            <SidebarBlock
              title={t("fill")}
              action={
                <Switch
                  id="fill-switch"
                  checked={currentFillEnabled}
                  onCheckedChange={(checked) => setCurrentFillEnabled(checked)}
                />
              }
            >
              <PropertiesRow className="justify-end">
                <ColorInput
                  preview
                  value={currentFillColor}
                  onChange={setCurrentFillColor}
                />
              </PropertiesRow>
            </SidebarBlock>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
