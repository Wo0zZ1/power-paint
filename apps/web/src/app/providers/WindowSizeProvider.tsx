"use client";

import type { PropsWithChildren } from "react";
import { useEffect } from "react";

import { initWindowSizeListener } from "@/shared/store";

export const WindowSizeProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    const cleanup = initWindowSizeListener();
    return cleanup;
  });

  return children;
};
