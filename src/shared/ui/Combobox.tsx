"use client";

import { useRef, useState } from "react";

import { cn } from "@/shared/lib/utils";

import { useOnClickOutside } from "../lib/hooks";

import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";

export interface ComboboxProps<T> {
  items: T[];
  value: string;
  onValueChange: (value: string) => void;
  onSelect: (item: T) => void;
  renderItem: (item: T) => React.ReactNode;
  maxVisibleItems?: number;
  placeholder?: string;
  className?: string;
  rightAddon?: React.ReactNode;
  disabled?: boolean;
}

export function Combobox<T>({
  items,
  value,
  onValueChange,
  onSelect,
  renderItem,
  maxVisibleItems = 3,
  placeholder = "Search...",
  className,
  rightAddon,
  disabled = false,
}: ComboboxProps<T>) {
  const rootRef = useRef<HTMLDivElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const visibleItems = items.slice(0, maxVisibleItems);

  const selectItem = (item: T) => {
    onSelect(item);
    onValueChange("");
    setIsFocused(false);
  };

  useOnClickOutside(rootRef, () => setIsFocused(false));

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <InputGroup className="h-full px-2">
        <InputGroupInput
          value={value}
          autoComplete="off"
          type="text"
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => {
            if (disabled) return;
            setIsFocused(true);
          }}
          onChange={(e) => {
            if (disabled) return;
            onValueChange(e.target.value);
            setIsFocused(true);
          }}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlightedIndex((prev) =>
                Math.min(prev + 1, visibleItems.length - 1),
              );
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlightedIndex((prev) => Math.max(prev - 1, 0));
            }
            if (e.key === "Enter" && visibleItems[highlightedIndex]) {
              e.preventDefault();
              selectItem(visibleItems[highlightedIndex]);
            }
          }}
        />

        {rightAddon && (
          <InputGroupAddon align="inline-end">{rightAddon}</InputGroupAddon>
        )}
      </InputGroup>

      {isFocused && !disabled && (
        <ul className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-border bg-popover text-sm shadow-lg">
          {visibleItems.map((item, index) => (
            <li
              key={index}
              className={cn(
                "cursor-pointer",
                index === highlightedIndex ? "bg-muted" : "hover:bg-muted",
              )}
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={() => selectItem(item)}
            >
              {renderItem(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
