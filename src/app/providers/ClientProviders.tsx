"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";

import { getMessageFallback } from "@/shared/i18n";
import { Toaster } from "@/shared/ui/sonner";
import { TooltipProvider } from "@/shared/ui/tooltip";

import { ThemeProvider } from "./ThemeProvider";
import { WindowSizeProvider } from "./WindowSizeProvider";

interface ClientProvidersProps {
  children: React.ReactNode;
  session: Session | null;
  locale: string;
  messages: Record<string, unknown>;
  timeZone: string;
}

export function ClientProviders({
  children,
  session,
  locale,
  messages,
  timeZone,
}: ClientProvidersProps) {
  return (
    <SessionProvider session={session}>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone={timeZone}
        getMessageFallback={getMessageFallback}
      >
        <ThemeProvider>
          <TooltipProvider>
            <WindowSizeProvider>{children}</WindowSizeProvider>
            <Toaster position="top-center" />
          </TooltipProvider>
        </ThemeProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
