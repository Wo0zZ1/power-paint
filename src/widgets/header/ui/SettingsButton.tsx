"use client";

import { EllipsisVertical } from "lucide-react";
import { useTranslations } from "next-intl";

import { LanguageSwitcherMenuItem } from "@/features/language-switcher";
import { ThemeSwitcherMenuItem } from "@/features/theme-switcher";
import { TOOLTIP_DELAY } from "@/shared/config";
import { useTooltip } from "@/shared/lib/hooks";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui";

export function SettingsButton() {
  const settingsTitle = useTranslations("settings")("title");

  const { tooltipOpen, handleMouseEnter, handleMouseLeave } = useTooltip();

  return (
    <DropdownMenu>
      <Tooltip
        open={tooltipOpen}
        delayDuration={TOOLTIP_DELAY}
        disableHoverableContent
      >
        <TooltipTrigger asChild>
          <div>
            <DropdownMenuTrigger asChild>
              <Button
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="rounded-full"
                size="icon-lg"
                variant="outline"
              >
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{settingsTitle}</p>
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{settingsTitle}</DropdownMenuLabel>

          <Separator className="my-1" />

          <LanguageSwitcherMenuItem />

          <ThemeSwitcherMenuItem />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
