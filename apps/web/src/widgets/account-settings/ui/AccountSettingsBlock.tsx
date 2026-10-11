import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";

import { getQueryClient } from "@/shared/api";

import { getOwnProfileQueryOption } from "@/entities/user/server";

import { AccountSettings } from "./AccountSettings";

export async function AccountSettingsBlock() {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();

  // fetchQuery, а не prefetch: без профиля форме нечего показать, и отказ
  // сервиса должен дойти до страницы ошибки с повтором.
  await queryClient.fetchQuery(
    getOwnProfileQueryOption({ cookieString: cookieStore.toString() }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AccountSettings />
    </HydrationBoundary>
  );
}
