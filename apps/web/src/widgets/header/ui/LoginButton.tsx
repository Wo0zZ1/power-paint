"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { cn } from "@/utils";

import { ROUTES } from "@/shared/config";
import { Button } from "@/shared/ui";

interface LoginButtonProps {
  className?: string;
}

export function LoginButton({ className }: LoginButtonProps) {
  const t = useTranslations("auth");

  return (
    <Button asChild size="lg" className={cn("group", className)} variant="secondary">
      <Link href={ROUTES.SIGNIN}>
        {t("sign_in")}
        <LogIn className="relative left-0 group-hover:left-1 transition-all" />
      </Link>
    </Button>
  );
}
