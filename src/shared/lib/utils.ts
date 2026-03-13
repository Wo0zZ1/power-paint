import type { User } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function shortenEmail(email: string, maxLocalLength = 6): string {
  const [localPart, domain] = email.split("@");
  if (localPart.length <= maxLocalLength) return email;

  const shortenedLocal = `${localPart.slice(0, maxLocalLength)}..${localPart.slice(-1)}`;
  return `${shortenedLocal}@${domain}`;
}

export function getUserPublicInfo(
  user: User,
): Pick<User, "id" | "name" | "image" | "email" | "created_at"> {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    created_at: user.created_at,
  };
}

export const getBadgeContentByAccessRole = (accessRole: string) => {
  switch (accessRole) {
    case "OWNER":
      return "Owner";
    case "ADMIN":
      return "Admin";
    case "EDITOR":
      return "Editor";
    case "VIEWER":
      return "Viewer";
    case "NONE":
      return "None";
    default:
      return "Unknown";
  }
};

export const generateRandomColor = () =>
  `hsl(${Math.floor(Math.random() * 360)}, 70%, 45%)`;

export const getParsedUsername = (
  name: string[],
  guest: boolean,
  t: (key: string) => string,
): string => {
  return (guest ? name.map((part) => t(part)) : name).join(" ");
};

export const generateRandomUsername = (): [string, string] => {
  const adjectives = ["Swift", "Silent", "Brave", "Clever", "Mighty"];
  const animals = ["Lion", "Eagle", "Wolf", "Tiger", "Bear"];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];

  return [adjective, animal];
};

export const getContrastingTextColor = (bgColor: string): string => {
  const hslMatch = bgColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

  if (hslMatch) {
    const l = parseInt(hslMatch[3]);

    return l > 50 ? "#000000" : "#ffffff";
  }

  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);

    // Calculate brightness using the YIQ formula
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "#000000" : "#ffffff";
  }

  // Default value
  return "#ffffff";
};

export const getBackgroundSizeForCursor = (text: string): number => {
  // Создаем временный canvas context для измерения текста
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  ctx.font = "12px sans-serif";
  const textWidth = ctx.measureText(text).width;

  return textWidth + 30;
};

export const invertHslColor = (hsl: string): string => {
  const hslMatch = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);

  if (!hslMatch) throw new Error("Invalid HSL color format");

  const h = parseInt(hslMatch[1]);
  const s = parseInt(hslMatch[2]);
  const l = 100 - parseInt(hslMatch[3]);

  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const invertHexColor = (hex: string): string => {
  const hsl = hexToHsl(hex);
  return invertHslColor(hsl);
};

export const hexToRgb = (hex: string): string => {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) throw new Error("Invalid hex color format");

  return `rgb(${parseInt(match[1], 16)}, ${parseInt(match[2], 16)}, ${parseInt(match[3], 16)})`;
};

export const rgbToHex = (rgb: string): string => {
  const match = rgb.match(/\d+/g);

  if (!match) throw new Error("Invalid RGB color format");

  const [r, g, b] = match.map(Number);

  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const rgbToHsl = (rgb: string): string => {
  const match = rgb.match(/\d+/g);

  if (!match) throw new Error("Invalid RGB color format");

  let [r, g, b] = match.map(Number);

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h, s;

  if (max == min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
      default:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

export const hexToHsl = (hex: string): string => {
  const rgbColor = hexToRgb(hex);
  return rgbToHsl(rgbColor);
};

export const normalizeHexColor = (hex: string): string => {
  if (!hex.startsWith("#")) hex = `#${hex}`;

  if (hex.length === 4)
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;

  return hex;
};

export const hexValueToInputValue = (value: string) => value.slice(1);

export const degToRad = (deg: number) => (deg * Math.PI) / 180;
export const radToDeg = (rad: number) => (rad * 180) / Math.PI;
