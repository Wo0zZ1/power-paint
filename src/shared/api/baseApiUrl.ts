import { isServer } from "@tanstack/react-query";

export const GET_BASE_API_URL = () => {
  if (isServer) return process.env.NEXTAUTH_URL + "/api";
  return "/api";
};
