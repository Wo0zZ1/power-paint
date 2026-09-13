"use client";

import type { ChangeEvent, RefObject } from "react";
import { useCallback, useEffect } from "react";

import { useThrottledCallback } from "./useThrottledCallback";

const initValue = (value: number | string, modulo?: number) => {
  if (value === "mixed") return "mixed";
  if (typeof value === "string") return value;

  const num = modulo !== undefined ? value % modulo : value;
  return Math.round(num).toString();
};

const NUMBER_REGEX = /^-?\d+(?:[.,]\d+)?$/;

interface UseNumberInputOptions {
  value: number | string;
  onChange: (value: number) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  min?: number | string;
  max?: number | string;
  modulo?: number;
  isFloat?: boolean;
}

export function useNumberInput({
  value,
  onChange,
  inputRef,
  min,
  max,
  modulo,
  isFloat,
}: UseNumberInputOptions) {
  useEffect(() => {
    const newValue = initValue(value, modulo);

    if (inputRef?.current) inputRef.current.value = newValue.toString();
  }, [value, modulo, inputRef]);

  const throttledOnChange = useThrottledCallback((value: number) => {
    if (value === undefined) return;
    if (min !== undefined && value < Number(min)) return;
    if (max !== undefined && value > Number(max)) return;

    const finalValue = modulo !== undefined ? value % modulo : value;

    onChange(finalValue);
  });

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;

      if (!NUMBER_REGEX.test(v)) return;

      const n = isFloat ? Number(v) : Math.round(Number(v));

      if (isNaN(n)) return;

      throttledOnChange(n);
    },
    [isFloat, throttledOnChange],
  );

  return {
    handleChange,
  };
}
