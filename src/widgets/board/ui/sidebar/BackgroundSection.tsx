"use client";

import { useTranslations } from "next-intl";
import { useShallow } from "zustand/react/shallow";

import { DEFAULT_BOARD_COLORS } from "@/shared/constants";
import {
  ColorButton,
  ColorInput,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Separator,
} from "@/shared/ui";
import { cn } from "@/utils";

import { useBoardStore, useSetGlobal } from "../../model";

export interface BackgroundSectionProps {
  className?: string;
}

export function BackgroundSection({ className }: BackgroundSectionProps) {
  const t = useTranslations("toolbar.sidebar");

  const { backgroundColor } = useBoardStore(useShallow((s) => s.globals));
  const setBackgroundColor = useSetGlobal("backgroundColor");

  if (!backgroundColor) return null;

  return (
    <div className={cn("flex gap-4", className)}>
      <div className="grid grid-cols-4 gap-x-4 gap-y-2">
        {DEFAULT_BOARD_COLORS.map((color) => (
          <ColorButton
            invertable
            key={color}
            color={color}
            active={color === backgroundColor}
            onSelect={setBackgroundColor}
            className="my-auto"
          />
        ))}
      </div>
      <Separator className="mx-auto h-auto!" orientation="vertical" />
      <div className="flex flex-col items-center justify-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ColorButton
              invertable
              color={backgroundColor}
              active={!DEFAULT_BOARD_COLORS.includes(backgroundColor)}
              className="size-10"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-40 w-min bg-secondary/85 backdrop-blur-sm"
            side="right"
          >
            <DropdownMenuLabel className="text-nowrap">
              {t("hexCode")}
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <div className="px-2 py-1.5">
              <ColorInput
                id="background-color-input"
                value={backgroundColor}
                onChange={setBackgroundColor}
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="text-xs text-muted-foreground font-mono">
          {backgroundColor.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
