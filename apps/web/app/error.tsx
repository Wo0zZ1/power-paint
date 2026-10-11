"use client";

import { ServerCrash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useTransition } from "react";

import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/ui";

export default function ErrorPage({ reset }: { reset: () => void }) {
  const t = useTranslations("errors.unavailable");
  const router = useRouter();
  const [isRetrying, startTransition] = useTransition();

  // reset перерисовывает только клиентскую часть, а упал серверный рендер:
  // без refresh повтор показал бы ту же ошибку из кэша.
  const handleRetry = useCallback(
    () =>
      startTransition(() => {
        router.refresh();
        reset();
      }),
    [router, reset],
  );

  return (
    <div className="grow grid">
      <Empty className="p-0 -mt-20" size="lg">
        <EmptyHeader>
          <EmptyMedia size="lg" variant="icon">
            <ServerCrash />
          </EmptyMedia>
          <EmptyTitle size="lg">{t("title")}</EmptyTitle>
          <EmptyDescription size="lg">{t("description")}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent size="lg">
          <Button
            size="lg"
            variant="secondary"
            onClick={handleRetry}
            disabled={isRetrying}
          >
            {t("retry")}
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
