import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import Link from "next/link";

import { ROUTES } from "@/shared/config";
import { getQueryClient } from "@/shared/api";

import { Button } from "@/shared/ui";

import { getBoardsQueryOption } from "@/entities/board/server";

import { BoardsCarousel } from "./BoardsCarousel";
import { getTranslations } from "next-intl/server";

export async function BoardsCarouselBlock() {
  const t = await getTranslations();

  const queryClient = getQueryClient();
  const cookieStore = await cookies();

  await queryClient.prefetchQuery(getBoardsQueryOption(cookieStore.toString()));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex justify-between items-end mt-8 mb-4">
        <h3 className="text-2xl font-semibold">{t("board.plural")}</h3>

        <Button size="xs" variant="link" className="text-sm" asChild>
          <Link href={ROUTES.DASHBOARD.BOARDS}>{t("viewAll")}</Link>
        </Button>
      </div>

      <BoardsCarousel />
    </HydrationBoundary>
  );
}
