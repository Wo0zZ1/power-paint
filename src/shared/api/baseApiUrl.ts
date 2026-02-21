import { isServer } from "@tanstack/react-query";

export const BASE_API_URL = () => {
  if (isServer) return process.env.NEXTAUTH_URL + "/api";
  return "/api";
};
