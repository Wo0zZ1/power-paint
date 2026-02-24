"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { useTheme } from "@/features/theme-switcher";
import { TooltipProvider } from "@/shared/ui/tooltip";

interface ClientProvidersProps {
  children: React.ReactNode;
  session: Session | null;
}

export function ClientProviders({ children, session }: ClientProvidersProps) {
  const {} = useTheme(); // TODO Нужно для корректной работы переключения темы при SSR, иначе возникает рассинхронизация между сервером и клиентом

  return (
    <SessionProvider session={session}>
      <TooltipProvider>{children}</TooltipProvider>
    </SessionProvider>
  );
}
