import { RocketIcon, Star } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { ROUTES } from "@/shared/config";
import { Button } from "@/shared/ui/button";

export function LandingCta() {
  const t = useTranslations("Landing.CTA");

  return (
    <section className="relative min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-3xl text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
          {t("ready_title")}
        </h2>
        <p className="text-xl text-muted-foreground mb-8 text-balance">
          {t("ready_desc")}
        </p>
        <Button
          asChild
          variant="default"
          size="lg"
          className="rounded-full text-lg px-8 py-6"
        >
          <Link href={ROUTES.DASHBOARD.ROOT}>{t("start_free")}</Link>
        </Button>
      </div>

      <div className="absolute inset-0 not-sm:invisible pointer-events-none">
        <Star className="size-12 text-foreground rotate-12 absolute top-1/5 left-1/5" />
        <Star className="size-12 text-foreground rotate-6 absolute bottom-2/5 right-1/5" />
        <Star className="size-12 text-foreground -rotate-18 absolute bottom-1/5 left-1/3" />

        <RocketIcon className="size-16 absolute top-1/6 right-1/6 text-foreground" />
      </div>
    </section>
  );
}
