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

export const initWindowSizeListener = () => {
  const handleResize = () => {
    useWindowSizeStore
      .getState()
      .setSize(window.innerWidth, window.innerHeight);
  };

  handleResize();
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
};
