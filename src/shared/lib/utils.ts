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
