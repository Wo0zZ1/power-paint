"use client";

import { useState, useRef, useCallback } from "react";

import { TOOLTIP_DELAY } from "@/shared/config";

export const useTooltip = (delay: number = TOOLTIP_DELAY) => {
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
  const timeoutRef = useRef<boolean>(false);

  const handleMouseEnter = useCallback(() => {
    timeoutRef.current = true;
    setTimeout(() => timeoutRef.current && setTooltipOpen(true), delay);
  }, [delay]);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = false;
    setTooltipOpen(false);
  }, []);

  return { tooltipOpen, handleMouseEnter, handleMouseLeave };
};
