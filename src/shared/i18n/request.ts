import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { DEFAULT_LOCALE } from "./config";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../../../public/i18n/${locale}.json`)).default,
  };
});
