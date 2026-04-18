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
  const { copy, copyAsImage, paste, duplicate } = useCopyPast();
  const removeSelectedElements = useBoardStore((s) => s.removeSelectedElements);
  const closeMenu = useContextMenuStore((s) => s.closeMenu);

  const getItems = (type: ContextMenuType): MenuItem[] => {
    switch (type) {
      case "canvas":
        return [
          {
            label: "Вставить",
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
            label: "Копировать",
            shortcut: "Ctrl+C",
            action: () => {
              copy();
              closeMenu();
            },
          },
          {
            label: "Копировать как PNG",
            action: () => {
              copyAsImage();
              closeMenu();
            },
          },
          {
            label: "Вставить",
            shortcut: "Ctrl+V",
            action: () => {
              paste();
              closeMenu();
            },
          },
          {
            label: "Дублировать",
            shortcut: "Ctrl+D",
            action: () => {
              duplicate();
              closeMenu();
            },
            separator: true,
          },
          {
            label: "Удалить",
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
