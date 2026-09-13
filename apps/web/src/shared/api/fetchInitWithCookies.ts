export const fetchInitWithCookies = (cookieString?: string) => {
  return {
    credentials: cookieString ? "include" : undefined,
    headers: cookieString ? { Cookie: cookieString } : undefined,
    cache: "no-store",
  } satisfies RequestInit;
};
