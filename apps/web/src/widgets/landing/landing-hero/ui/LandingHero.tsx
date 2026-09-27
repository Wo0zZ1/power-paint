import { Crown } from "lucide-react";
import * as motion from "motion/react-client";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { ROUTES } from "@/shared/config";
import { Button } from "@/shared/ui/button";

export function LandingHero() {
  const t = useTranslations("Landing.Hero");

  return (
    <motion.section
      initial={{ opacity: 0, y: 70, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1, type: "spring", bounce: 0.4 }}
      className="h-full w-full flex flex-col items-center justify-center px-8"
    >
      <h1 className="relative text-6xl md:text-8xl font-bold mb-6 text-center tracking-tighter">
        {t("title")}
        <span className="text-red-500 dark:invert">.</span>
        <span>
          <Crown className="size-24 absolute top-0 left-0 -translate-x-1/8 min-[396px]:-translate-x-5/8 md:-translate-x-1/2 -translate-y-6/8 min-[396px]:-translate-y-3/4 md:-translate-y-5/8 -rotate-30 fill-yellow-400 text-yellow-300 pointer-events-none" />
        </span>
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-8 text-center text-balance">
        {t("description")}
      </p>
      <div className="flex gap-4">
        <Button
          asChild
          variant="default"
          size="lg"
          className="rounded-full text-lg px-8 py-6"
        >
          <Link href={ROUTES.DASHBOARD.ROOT}>{t("start_free")}</Link>
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute flex inset-x-4 -top-20 xs:-top-24 -bottom-4 -md:inset-x-6 md:-top-16 md:-bottom-6 xl:-inset-16 border border-dashed border-blue-500 pointer-events-none"
      >
        <div className="absolute -translate-x-1/2 -translate-y-full w-1 h-10 border-l border-blue-500 border-dashed top-0 left-1/2" />
        <div className="absolute -translate-x-5/8 -translate-y-1/2 w-3 h-3 border-2 border-blue-500 rounded-full bg-white -top-10 left-1/2 cursor-grab pointer-events-auto" />

        <div className="absolute translate-x-1/2 -translate-y-1/2 w-3 h-3 border-2 border-blue-500 rounded-full bg-white top-0 right-0 cursor-ne-resize pointer-events-auto" />
        <div className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 border-2 border-blue-500 rounded-full bg-white top-0 left-0 cursor-nw-resize pointer-events-auto" />
        <div className="absolute -translate-x-1/2 translate-y-1/2 w-3 h-3 border-2 border-blue-500 rounded-full bg-white bottom-0 left-0 cursor-sw-resize pointer-events-auto" />
        <div className="absolute translate-x-1/2 translate-y-1/2 w-3 h-3 border-2 border-blue-500 rounded-full bg-white bottom-0 right-0 cursor-se-resize pointer-events-auto" />
      </motion.div>
    </motion.section>
  );
}
