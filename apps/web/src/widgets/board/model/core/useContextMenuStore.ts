import { create } from "zustand";

export type ContextMenuType = "canvas" | "element" | null;

interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  stageX: number;
  stageY: number;
  type: ContextMenuType;
  // multipleSelection: boolean;
  // hasGroup: boolean;
  openMenu: (props: {
    x: number;
    y: number;
    type: ContextMenuType;
    stageX?: number;
    stageY?: number;
    // multipleSelection?: boolean;
    // hasGroup?: boolean;
  }) => void;
  closeMenu: () => void;
}

export const useContextMenuStore = create<ContextMenuState>((set) => ({
  isOpen: false,
  x: 0,
  y: 0,
  stageX: 0,
  stageY: 0,
  type: null,
  openMenu: ({ x, y, type, stageX, stageY }) =>
    set({
      isOpen: true,
      x,
      y,
      stageX,
      stageY,
      type,
    }),
  closeMenu: () =>
    set({
      isOpen: false,
      type: null,
    }),
}));
