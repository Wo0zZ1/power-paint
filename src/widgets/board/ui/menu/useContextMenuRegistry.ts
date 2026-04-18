import { useTranslations } from "next-intl";

import {
  type ContextMenuType,
  useBoardStore,
  useContextMenuStore,
} from "../../model/core";
import { useCopyPast } from "../../model/tools";

export interface MenuItem {
  label: string;
  shortcut?: string;
  action: () => void;
  separator?: boolean;
}

export const useContextMenuRegistry = () => {
  const t = useTranslations("board.context_menu");

  const { copy, copyAsImage, exportAsImage, paste, duplicate } = useCopyPast();
  const removeSelectedElements = useBoardStore((s) => s.removeSelectedElements);
  const closeMenu = useContextMenuStore((s) => s.closeMenu);

  const getItems = (type: ContextMenuType): MenuItem[] => {
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
        return [
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
          {
            label: t("delete"),
            shortcut: "Del",
            action: () => {
              removeSelectedElements();
              closeMenu();
            },
          },
        ];
      case null:
        return [];
      default:
        const _: never = type;
        return _;
    }
  };

  return { getItems };
};
