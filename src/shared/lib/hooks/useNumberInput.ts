"use client";

import type { ChangeEvent } from "react";
import { useCallback, useEffect, useState } from "react";

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
  min?: number | string;
  max?: number | string;
  modulo?: number;
}

export function useNumberInput({
  value,
  onChange,
  min,
  max,
  modulo,
}: UseNumberInputOptions) {
  const [inputValue, setInputValue] = useState<number | string>(
    initValue(value, modulo),
  );

  useEffect(() => {
    const newValue = initValue(value, modulo);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInputValue(newValue);
  }, [value, modulo]);

  const throttledOnChange = useThrottledCallback(
    (inputValue: number | string, value?: number) => {
      setInputValue(inputValue);
      if (value !== undefined) {
        if (min !== undefined && value < Number(min)) return;
        if (max !== undefined && value > Number(max)) return;

        const finalValue = modulo !== undefined ? value % modulo : value;
        onChange(finalValue);
      }
    },
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;

      if (!NUMBER_REGEX.test(v)) return throttledOnChange(v);

      const n = Number(v);

      if (!isNaN(n)) throttledOnChange(v, n);
    },
    [throttledOnChange],
  );

  return {
    inputValue,
    handleChange,
  };
}
