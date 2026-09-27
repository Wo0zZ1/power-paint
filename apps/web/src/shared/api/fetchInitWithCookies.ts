// При серверном рендеринге запрос в API уходит от контейнера Web, и без адреса
// клиента gateway посчитал бы всех анонимных посетителей одним.
export const fetchInitWithCookies = ({
  cookieString,
  forwardedFor,
}: {
  cookieString?: string;
  forwardedFor?: string | null;
} = {}) => {
  const headers = {
    ...(cookieString && { Cookie: cookieString }),
    ...(forwardedFor && { "X-Forwarded-For": forwardedFor }),
  };

  return {
    credentials: cookieString ? "include" : undefined,
    headers: Object.keys(headers).length > 0 ? headers : undefined,
    cache: "no-store",
  } satisfies RequestInit;
};
