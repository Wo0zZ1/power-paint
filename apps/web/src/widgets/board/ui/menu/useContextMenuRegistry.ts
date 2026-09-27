import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";

import {
  type ContextMenuType,
  useContextMenuStore,
  useBoardStore,
  useGroupingState,
} from "../../model/core";
import { useCopyPast } from "../../model/tools";

export interface MenuItem {
  label: string;
  shortcut?: string;
  action: () => void;
  separator?: boolean;
  disabled?: boolean;
}

export interface IGetItemsProps {
  type: ContextMenuType;
  canGroup: boolean;
  canUngroup: boolean;
}

export const useContextMenuRegistry = () => {
  const t = useTranslations("board.context_menu");

  const { copy, copyAsImage, exportAsImage, paste, duplicate } = useCopyPast();
  const { selectedIds } = useGroupingState();
  const {
    removeSelectedElements,
    bringToFront,
    sendToBack,
    bringForward,
    sendBackward,
    groupSelected,
    ungroupSelected,
  } = useBoardStore(
    useShallow((s) => ({
      removeSelectedElements: s.removeSelectedElements,
      bringToFront: s.bringToFront,
      sendToBack: s.sendToBack,
      bringForward: s.bringForward,
      sendBackward: s.sendBackward,
      groupSelected: s.groupSelected,
      ungroupSelected: s.ungroupSelected,
    })),
  );
  const closeMenu = useContextMenuStore((s) => s.closeMenu);

  const getItems = useCallback(
    ({
      type,
      canGroup: canGroupProp,
      canUngroup: canUngroupProp,
    }: IGetItemsProps): MenuItem[] => {
      switch (type) {
        case "canvas":
          return [
            {
              label: t("paste"),
              shortcut: "Ctrl+V",
              action: () => {
                const { stageX, stageY } = useContextMenuStore.getState();
                paste({ x: stageX, y: stageY });
                closeMenu();
              },
            },
          ];
        case "element":
          const items: MenuItem[] = [
            {
              label: t("copy"),
              shortcut: "Ctrl+C",
              action: () => {
                copy();
                closeMenu();
              },
            },
            {
              label: t("copy_as_png"),
              action: () => {
                copyAsImage("png");
                closeMenu();
              },
            },
            {
              label: t("copy_as_jpeg"),
              action: () => {
                copyAsImage("jpeg");
                closeMenu();
              },
            },
            {
              label: t("export_as_png"),
              action: () => {
                exportAsImage("png");
                closeMenu();
              },
              separator: true,
            },
            {
              label: t("export_as_jpeg"),
              action: () => {
                exportAsImage("jpeg");
                closeMenu();
              },
            },
            {
              label: t("paste"),
              shortcut: "Ctrl+V",
              action: () => {
                const { stageX, stageY } = useContextMenuStore.getState();
                paste({ x: stageX, y: stageY });
                closeMenu();
              },
              separator: true,
            },
            {
              label: t("duplicate"),
              shortcut: "Ctrl+D",
              action: () => {
                duplicate();
                closeMenu();
              },
              separator: true,
            },
          ];

          items.push({
            label: t("group"),
            shortcut: "Ctrl+G",
            disabled: !canGroupProp,
            action: () => {
              groupSelected();
              closeMenu();
            },
          });

          items.push({
            label: t("ungroup"),
            shortcut: "Ctrl+Shift+G",
            disabled: !canUngroupProp,
            action: () => {
              ungroupSelected();
              closeMenu();
            },
          });

          items.push(
            {
              label: t("bring_to_front"),
              action: () => {
                bringToFront(selectedIds);
                closeMenu();
              },
              separator: true,
            },
            {
              label: t("bring_forward"),
              action: () => {
                bringForward(selectedIds);
                closeMenu();
              },
            },
            {
              label: t("send_backward"),
              action: () => {
                sendBackward(selectedIds);
                closeMenu();
              },
            },
            {
              label: t("send_to_back"),
              action: () => {
                sendToBack(selectedIds);
                closeMenu();
              },
            },
            {
              label: t("delete"),
              shortcut: "Del",
              separator: true,
              action: () => {
                removeSelectedElements();
                closeMenu();
              },
            },
          );

          return items;
        case null:
          return [];
        default:
          const _: never = type;
          return _;
      }
    },
    [
      bringForward,
      bringToFront,
      closeMenu,
      copy,
      copyAsImage,
      duplicate,
      exportAsImage,
      groupSelected,
      paste,
      removeSelectedElements,
      sendBackward,
      sendToBack,
      ungroupSelected,
      t,
      selectedIds,
    ],
  );

  return { getItems };
};
