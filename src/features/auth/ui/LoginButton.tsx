"use client";

import { LogIn } from "lucide-react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

import { ROUTES } from "@/shared/config";
import { Button } from "@/shared/ui";
import { cn } from "@/utils";

interface LoginButtonProps {
  className?: string;
}

export function LoginButton({ className }: LoginButtonProps) {
  const t = useTranslations("auth");

  return (
    <Button
      size="lg"
      className={cn("group", className)}
      variant="secondary"
      onClick={() =>
        signIn(undefined, {
          redirect: true,
          callbackUrl: ROUTES.DASHBOARD.ROOT,
        })
      }
    >
      {t("login")}
      <LogIn className="relative left-0 group-hover:left-1 transition-all" />
    </Button>
  );
}
