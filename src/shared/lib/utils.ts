import { User } from "@prisma/client/client";
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
