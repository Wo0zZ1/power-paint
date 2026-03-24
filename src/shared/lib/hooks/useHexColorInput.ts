"use client";

import type { ChangeEvent, RefObject } from "react";
import { useCallback, useMemo, useState } from "react";

import { hexValueToInputValue, normalizeHexColor } from "@/utils";

import { useThrottledCallback } from "./useThrottledCallback";

const HEX_REGEX = /^\#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
const HEX_INPUT_REGEX = /^([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;

interface UseColorInputOptions {
  value: string;
  colorInputRef?: RefObject<HTMLInputElement | null>;
  exceptionValues?: string[];
  onChange: (value: string) => void;
}

export const useColorInput = ({
  value,
  colorInputRef,
  exceptionValues = [],
  onChange,
}: UseColorInputOptions) => {
  const [inputValue, setInputValue] = useState(hexValueToInputValue(value));

  const defaultValue = useMemo(() => hexValueToInputValue(value), [value]);

  const isValid = useMemo(
    () =>
      HEX_INPUT_REGEX.test(inputValue) ||
      exceptionValues.some((ev) => inputValue === ev),
    [exceptionValues, inputValue],
  );

  const resetValue = useCallback(() => {
    setInputValue(hexValueToInputValue(value));
    if (!colorInputRef?.current) return;
    colorInputRef.current.value = value;
  }, [colorInputRef, value]);

  const throttledOnChange = useThrottledCallback(
    (inputValue: string, value?: string) => {
      if (value) onChange(value);
      setInputValue(inputValue);
    },
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const value = normalizeHexColor(inputValue);

      if (!HEX_INPUT_REGEX.test(inputValue))
        return throttledOnChange(inputValue);

      throttledOnChange(inputValue, value);
    },
    [throttledOnChange],
  );

  const handlePickerChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const inputValue = hexValueToInputValue(value);

      if (!HEX_REGEX.test(value)) return throttledOnChange(value);

      throttledOnChange(inputValue, value);
    },
    [throttledOnChange],
  );

  const handleInputBlur = useCallback(() => {
    if (!colorInputRef?.current) return;

    resetValue();
  }, [colorInputRef, resetValue]);

  return {
    defaultValue,
    isValid,
    handleInputChange,
    handlePickerChange,
    handleInputBlur,
  };
};
