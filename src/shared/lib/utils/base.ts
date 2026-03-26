import type { User } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { AccessRole } from "@/shared/constants";

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

export const getBadgeContentByAccessRole = (accessRole: AccessRole) => {
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
      const _: never = accessRole;
  }
};

export const getParsedUsername = (
  name: string[],
  guest: boolean,
  t: (key: string) => string,
): string => {
  return (guest ? name.map((part) => t(part)) : name).join(" ");
};

export const getBackgroundSizeForCursor = (text: string): number => {
  // Создаем временный canvas context для измерения текста
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  ctx.font = "12px sans-serif";
  const textWidth = ctx.measureText(text).width;

  return textWidth + 30;
};

// Random Section

export const generateRandomUsername = (): [string, string] => {
  const adjectives = ["Swift", "Silent", "Brave", "Clever", "Mighty"];
  const animals = ["Lion", "Eagle", "Wolf", "Tiger", "Bear"];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];

  return [adjective, animal];
};

export const generateRandomNumber = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export const generateRandomInteger = (min: number, max: number) =>
  Math.floor(generateRandomNumber(min, max + 1));

// Utils Section

export const phoneRegex = /^[\d+()\s-]{6,20}$/;

export const degToRad = (deg: number) => (deg * Math.PI) / 180;
export const radToDeg = (rad: number) => (rad * 180) / Math.PI;

export const fromDate = (timeToAdd: number, date: Date = new Date()) =>
  new Date(date.getTime() + timeToAdd);
