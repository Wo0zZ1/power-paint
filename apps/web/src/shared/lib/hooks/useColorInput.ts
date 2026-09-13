"use client";

import type { ChangeEvent, RefObject } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { hexValueToInputValue, normalizeHexColor } from "@/utils";

import { useThrottledCallback } from "./useThrottledCallback";

const HEX_REGEX = /^\#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
const HEX_INPUT_REGEX = /^([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;

interface UseColorInputOptions {
  value: string;
  colorInputRef: RefObject<HTMLInputElement | null>;
  exceptionValues?: string[];
  onChange: (value: string) => void;
}

export const useColorInput = ({
  value,
  colorInputRef,
  exceptionValues = [],
  onChange,
}: UseColorInputOptions) => {
  const [isValid, setIsValid] = useState<boolean>(true);

  const defaultValue = useMemo(() => hexValueToInputValue(value), [value]);

  useEffect(() => {
    const input = colorInputRef.current;
    if (!input) return;

    if (normalizeHexColor(input.value) !== value)
      input.value = hexValueToInputValue(value);
  }, [value, colorInputRef, exceptionValues]);

  const resetValue = useCallback(() => {
    if (!colorInputRef.current) return;

    colorInputRef.current.value = hexValueToInputValue(value);
    setIsValid(true);
  }, [colorInputRef, value]);

  const throttledOnChange = useThrottledCallback((value: string) => {
    if (value) onChange(value);
  });

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const value = normalizeHexColor(inputValue);

      const isValidColor = HEX_INPUT_REGEX.test(inputValue);
      const isExceptionValue = exceptionValues.some((ev) => inputValue === ev);

      setIsValid(isValidColor || isExceptionValue);

      if (!isValidColor) return;

      throttledOnChange(value);
    },
    [throttledOnChange, setIsValid, exceptionValues],
  );

  const handlePickerChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (!HEX_REGEX.test(value)) return;

      throttledOnChange(value);
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
