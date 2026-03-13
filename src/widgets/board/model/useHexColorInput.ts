import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { useCallback, useMemo, useState } from "react";

import { hexValueToInputValue, normalizeHexColor } from "@/utils";

import { useThrottledCallback } from "../lib/useThrottledCallback";

const HEX_REGEX = /^\#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
const HEX_INPUT_REGEX = /^([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;

interface UseHexColorInputOptions {
  value: string;
  onChange: (value: string) => void;
}

interface UseHexColorInputReturn {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  isValid: boolean;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handlePickerChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const useHexColorInput = ({
  value,
  onChange,
}: UseHexColorInputOptions): UseHexColorInputReturn => {
  const [inputValue, setInputValue] = useState(hexValueToInputValue(value));

  const isValid = useMemo(() => HEX_INPUT_REGEX.test(inputValue), [inputValue]);

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

  return {
    inputValue,
    setInputValue,
    isValid,
    handleInputChange,
    handlePickerChange,
  };
};
