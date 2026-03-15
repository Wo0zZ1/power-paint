"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";

import { getMessageFallback } from "@/shared/i18n";
import { useTheme } from "@/shared/lib/theme";
import { TooltipProvider } from "@/shared/ui/tooltip";

interface ClientProvidersProps {
  children: React.ReactNode;
  session: Session | null;
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: Record<string, any>;
  timeZone: string;
}

export function ClientProviders({
  children,
  session,
  locale,
  messages,
  timeZone,
}: ClientProvidersProps) {
  const {} = useTheme(); // TODO Нужно для корректной работы переключения темы при SSR, иначе возникает рассинхронизация между сервером и клиентом

  return (
    <SessionProvider session={session}>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone={timeZone}
        getMessageFallback={getMessageFallback}
      >
        <TooltipProvider>{children}</TooltipProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
