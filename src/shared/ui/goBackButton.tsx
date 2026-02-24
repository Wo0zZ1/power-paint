"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { memo, useCallback } from "react";
import type { MouseEvent } from "react";

import { Button } from "./button";

export const Component = (props: React.ComponentProps<typeof Button>) => {
  const t = useTranslations();
  const router = useRouter();

  const handleMouseClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const isMiddleClick = e.button === 1;

      if (isMiddleClick) {
        e.preventDefault();
        const backUrl = document.referrer || "/";
        window.open(backUrl, "_blank", "noreferrer");
        return;
      }

      router.back();
    },
    [router],
  );

  return (
    <Button onClick={handleMouseClick} onAuxClick={handleMouseClick} {...props}>
      {t("goBack")}
    </Button>
  );
};

export const GoBackButton = memo(Component);
