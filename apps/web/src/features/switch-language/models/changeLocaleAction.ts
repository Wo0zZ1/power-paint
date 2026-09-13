"use server";

import { cookies } from "next/headers";

export async function changeLocaleAction(locale: string) {
  const cookieStore = await cookies();

  cookieStore.set("locale", locale);
}
