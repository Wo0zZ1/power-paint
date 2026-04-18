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

  const { copy, copyAsImage, paste, duplicate } = useCopyPast();
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
              paste();
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
              copyAsImage();
              closeMenu();
            },
          },
          {
            label: t("paste"),
            shortcut: "Ctrl+V",
            action: () => {
              paste();
              closeMenu();
            },
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
