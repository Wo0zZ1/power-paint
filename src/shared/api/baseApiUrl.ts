import { isServer } from "@tanstack/react-query";

export const GET_BASE_API_URL = () => {
  if (isServer) return `http://127.0.0.1:${process.env.PORT}/api`;

  return "/api";
};
