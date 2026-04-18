import { create } from "zustand";

export type ContextMenuType = "canvas" | "element" | null;

interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  type: ContextMenuType;
  openMenu: (x: number, y: number, type: ContextMenuType) => void;
  closeMenu: () => void;
}

export const useContextMenuStore = create<ContextMenuState>((set) => ({
  isOpen: false,
  x: 0,
  y: 0,
  type: null,
  openMenu: (x, y, type) => set({ isOpen: true, x, y, type }),
  closeMenu: () => set({ isOpen: false, type: null }),
}));