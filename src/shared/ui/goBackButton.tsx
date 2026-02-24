"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { memo, useCallback } from "react";

import { Button } from "./button";

export const Component = (props: React.ComponentProps<typeof Button>) => {
  const t = useTranslations();
  const router = useRouter();

  const handleMouseClick = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <Button
      onMouseDown={(e) => e.preventDefault()}
      onClick={handleMouseClick}
      {...props}
    >
      {t("goBack")}
    </Button>
  );
};

export const GoBackButton = memo(Component);
