import { cookies, headers } from "next/headers";
import { cache } from "react";

import { fetchSession } from "./api";

// cache на время одного рендера: layout, страница и виджеты спрашивают сессию
// независимо, а запрос уходит один раз.
export const getSession = cache(async () => {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);

  return fetchSession({
    cookieString: cookieStore.toString(),
    forwardedFor: headerStore.get("x-forwarded-for"),
  });
});
