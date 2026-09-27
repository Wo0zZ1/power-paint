"use client";

import {
  BringToFront,
  Link2,
  MoveDown,
  MoveUp,
  SendToBack,
  Unlink2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useShallow } from "zustand/react/shallow";

import { TOOLTIP_DELAY } from "@/shared/constants";
import {
  Button,
  ButtonGroup,
  Label,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui";

import type { PropertySectionProps } from "../../model";
import { useBoardStore, useGroupingState } from "../../model";
import { PropertiesRow } from "../properties";

import { SidebarBlock } from "./SidebarBlock";

export function GroupingSection({}: PropertySectionProps) {
  const t = useTranslations("toolbar.sidebar");

  const { selectedIds, canGroup, canUngroup } = useGroupingState();
  const {
    bringToFront,
    bringForward,
    sendBackward,
    sendToBack,
    groupSelected,
    ungroupSelected,
  } = useBoardStore(
    useShallow((s) => ({
      bringToFront: s.bringToFront,
      bringForward: s.bringForward,
      sendBackward: s.sendBackward,
      sendToBack: s.sendToBack,
      groupSelected: s.groupSelected,
      ungroupSelected: s.ungroupSelected,
    })),
  );

  if (selectedIds.size === 0) return null;

  return (
    <SidebarBlock title={t("grouping")}>
      <PropertiesRow>
        <Label className="text-xs text-muted-foreground">{t("order")}</Label>

        <ButtonGroup className="justify-end">
          <Tooltip delayDuration={TOOLTIP_DELAY} disableHoverableContent>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => bringToFront(selectedIds)}
              >
                <BringToFront className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("bring_to_front")}</TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={TOOLTIP_DELAY} disableHoverableContent>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => bringForward(selectedIds)}
              >
                <MoveUp className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("bring_forward")}</TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={TOOLTIP_DELAY} disableHoverableContent>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => sendBackward(selectedIds)}
              >
                <MoveDown className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("send_backward")}</TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={TOOLTIP_DELAY} disableHoverableContent>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => sendToBack(selectedIds)}
              >
                <SendToBack className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("send_to_back")}</TooltipContent>
          </Tooltip>
        </ButtonGroup>
      </PropertiesRow>

      <PropertiesRow>
        <Tooltip delayDuration={TOOLTIP_DELAY} disableHoverableContent>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={groupSelected}
              disabled={!canGroup}
              className="gap-1.5"
            >
              <Link2 className="size-3.5" />
              {t("group")}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("group")}</TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={TOOLTIP_DELAY} disableHoverableContent>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={ungroupSelected}
              disabled={!canUngroup}
              className="gap-1.5"
            >
              <Unlink2 className="size-3.5" />
              {t("ungroup")}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("ungroup")}</TooltipContent>
        </Tooltip>
      </PropertiesRow>
    </SidebarBlock>
  );
}
