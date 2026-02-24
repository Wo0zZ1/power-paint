import type { Theme } from "./config";

export const getSystemTheme = (): Exclude<Theme, "system"> => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};
