import {
  MousePointer2,
  Hand,
  Square,
  Circle,
  Pencil,
  Eraser,
  Type,
  Image,
} from "lucide-react";
import type { ElementType } from "react";

export type Tool =
  | "select"
  | "hand"
  | "rect"
  | "circle"
  | "draw"
  | "text"
  | "image"
  | "eraser";

export const TOOLS: { tool: Tool; Icon: ElementType; shortcut: string }[] = [
  { tool: "select", Icon: MousePointer2, shortcut: "S" },
  { tool: "hand", Icon: Hand, shortcut: "H" },
  { tool: "rect", Icon: Square, shortcut: "R" },
  { tool: "circle", Icon: Circle, shortcut: "C" },
  { tool: "draw", Icon: Pencil, shortcut: "D" },
  { tool: "text", Icon: Type, shortcut: "T" },
  { tool: "image", Icon: Image, shortcut: "I" },
  { tool: "eraser", Icon: Eraser, shortcut: "E" },
];
