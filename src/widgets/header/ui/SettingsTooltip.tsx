"use client";

import type { PropsWithChildren } from "react";

import { TOOLTIP_DELAY } from "@/shared/constants";
import {
  TooltipTrigger,
  DropdownMenuTrigger,
  TooltipContent,
  Tooltip,
} from "@/shared/ui";

interface SettingsTooltipProps {
  content: string;
}

export function SettingsTooltip({
  children,
  content,
}: PropsWithChildren<SettingsTooltipProps>) {
  return (
    <Tooltip delayDuration={TOOLTIP_DELAY} disableHoverableContent>
      <TooltipTrigger>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      </TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
