"use client";

import type { ChangeEvent, ComponentProps, ReactNode } from "react";
import { useCallback, useId, useMemo, useRef, useState } from "react";

import { useOnClickOutside } from "@/lib/hooks/useOnClickOutside";

import { cn } from "@/shared/lib/utils";

import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";

type ComboboxProps<T> = {
  items?: T[];
  input: string;
  isFetching?: boolean;
  onInputChange: (input: string) => void;
  onSelect: (item: T) => void;
  maxVisibleItems?: number;
  placeholder?: string;
  className?: string;
  rightAddon?: ReactNode;
  LoadingItem?: ReactNode;
  EmptyItem?: ReactNode;
  renderItem: (item: T) => ReactNode;
} & Pick<
  ComponentProps<typeof InputGroupInput>,
  "type" | "autoComplete" | "disabled" | "name"
>;

export function Combobox<T>({
  type,
  name,
  items,
  input,
  disabled,
  autoComplete = "nope",
  isFetching,
  onInputChange,
  onSelect,
  maxVisibleItems = 3,
  placeholder,
  className,
  rightAddon,
  LoadingItem,
  EmptyItem,
  renderItem,
}: ComboboxProps<T>) {
  const listboxId = useId();

  const rootRef = useRef<HTMLDivElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const visibleItems = useMemo(
    () => items?.slice(0, maxVisibleItems),
    [items, maxVisibleItems],
  );

  useOnClickOutside(rootRef, () => setIsFocused(false));

  const selectItem = useCallback(
    (item: T) => {
      onSelect(item);
      setIsFocused(false);
      onInputChange("");
    },
    [onSelect, onInputChange],
  );

  const handleFocus = useCallback(() => {
    if (disabled) return;

    setIsFocused(true);
  }, [disabled, setIsFocused]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      setIsFocused(true);
      onInputChange(e.target.value);
    },
    [disabled, onInputChange, setIsFocused],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled || !visibleItems) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          Math.min(prev + 1, visibleItems.length - 1),
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        selectItem(visibleItems[highlightedIndex]);
      }
    },
    [disabled, visibleItems, highlightedIndex, selectItem],
  );

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <InputGroup className="h-full px-2">
        <InputGroupInput
          role="combobox"
          aria-expanded={isFocused}
          aria-controls={isFocused ? listboxId : undefined}
          type={type}
          name={name}
          value={input}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onFocus={handleFocus}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        {rightAddon && (
          <InputGroupAddon align="inline-end">{rightAddon}</InputGroupAddon>
        )}
      </InputGroup>

      {isFocused && (
        <div className="absolute z-50 max-h-56 overflow-y-auto w-full mt-1 rounded-lg border border-border bg-popover shadow-lg text-sm">
          <ul id={listboxId} role="listbox">
            {visibleItems?.map((item, index) => (
              <li
                role="option"
                aria-selected={index === highlightedIndex}
                key={index}
                className={cn("cursor-pointer hover:bg-muted", {
                  "bg-muted": index === highlightedIndex,
                })}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => selectItem(item)}
              >
                {renderItem(item)}
              </li>
            ))}

            {isFetching && <li>{LoadingItem}</li>}

            {!isFetching && items?.length === 0 && EmptyItem && (
              <li>{EmptyItem}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
