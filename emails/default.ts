export const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_BASE_URL
    : process.env.NEXT_PUBLIC_BASE_DEPLOY_URL;

export const currentYear = new Date().getFullYear();
