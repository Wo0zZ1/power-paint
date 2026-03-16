import type { BaseElementType, ElementType } from "../../model/types";

export interface PropertySectionProps {
  elements: ElementType[];
  update: <T extends ElementType>(
    change: Partial<T> | ((prev: T) => Partial<T>),
  ) => void;
}

export function getCommonElementProperties<
  T extends BaseElementType,
  K extends keyof T,
  F,
>(elements: T[], property: K, fallback: F = "mixed" as F): T[K] | F {
  const values = elements.map((el) => el[property]);
  const uniqueValues = new Set(values);
  return uniqueValues.size === 1 ? values[0] : fallback;
}
