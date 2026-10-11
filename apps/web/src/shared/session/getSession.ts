import { cookies, headers } from "next/headers";
import { cache } from "react";

import { fetchSession } from "./api";

// cache на время одного рендера: layout, страница и виджеты спрашивают сессию
// независимо, а запрос уходит один раз.
export const getKnownSession = cache(async () => {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);

  return fetchSession({
    cookieString: cookieStore.toString(),
    forwardedFor: headerStore.get("x-forwarded-for"),
  });
});

// Шапке, доске и страницам входа хватает гостевого вида, пока сессию не узнать:
// страница остаётся рабочей. Защищённые страницы берут getKnownSession.
export const getSession = () => getKnownSession().catch(() => null);
