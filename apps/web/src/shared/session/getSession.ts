import { cookies } from "next/headers";
import { cache } from "react";

import { fetchSession } from "./api";

// cache на время одного рендера: layout, страница и виджеты спрашивают сессию
// независимо, а запрос уходит один раз.
export const getSession = cache(async () => {
  const cookieStore = await cookies();

  return fetchSession(cookieStore.toString());
});
