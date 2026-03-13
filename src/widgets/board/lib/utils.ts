import type { FillType, GradientType, StrokeType } from "../model/types";

export const generateId = (): string => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(
    "",
  );

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

export const getFillPriority = (
  fillType: FillType,
  gradientType: GradientType,
): "color" | "linear-gradient" | "radial-gradient" => {
  if (fillType === "gradient") {
    if (gradientType === "linear") return "linear-gradient";
    else if (gradientType === "radial") return "radial-gradient";
  }
  return "color";
};

export const getDash = (strokeType: StrokeType): number[] => {
  switch (strokeType) {
    case "dashed":
      return [6, 3];
    case "dash_dotted":
      return [6, 3, 2, 3];
    case "solid":
    default:
      return [];
  }
};
