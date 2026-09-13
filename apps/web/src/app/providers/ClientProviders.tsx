"use client";

import type { SessionUser } from "@power-paint/contracts";

import { SessionProvider } from "@/shared/session";
import { NextIntlClientProvider } from "next-intl";

import { getMessageFallback } from "@/shared/i18n";
import { Toaster } from "@/shared/ui/sonner";
import { TooltipProvider } from "@/shared/ui/tooltip";

import { ThemeProvider } from "./ThemeProvider";
import { WindowSizeProvider } from "./WindowSizeProvider";

interface ClientProvidersProps {
  children: React.ReactNode;
  user: SessionUser | null;
  locale: string;
  messages: Record<string, unknown>;
  timeZone: string;
}

export function ClientProviders({
  children,
  user,
  locale,
  messages,
  timeZone,
}: ClientProvidersProps) {
  return (
    <SessionProvider user={user}>
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
