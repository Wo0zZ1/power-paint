import { create } from "zustand";

interface WindowSizeState {
  width: number;
  height: number;
  setSize: (width: number, height: number) => void;
}

export const useWindowSizeStore = create<WindowSizeState>((set) => ({
  width: 0,
  height: 0,
  setSize: (width, height) => set({ width, height }),
}));

let isInitialized = false;

export const initWindowSizeListener = () => {
  if (typeof window === "undefined" || isInitialized) return;

  isInitialized = true;

  const handleResize = () => {
    useWindowSizeStore
      .getState()
      .setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
    isInitialized = false;
  };
};
