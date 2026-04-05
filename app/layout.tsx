import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { getLocale, getMessages, getTimeZone } from "next-intl/server";
import type { ReactNode } from "react";

import { ClientProviders, QueryProvider } from "@/app/providers";
import { ThemeScript } from "@/features/switch-theme/ui/ThemeScript";
import { auth } from "@/shared/auth";
import { Header } from "@/widgets/header";

import { geistMono, geistSans, interSans } from "./fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Power Paint",
    default: "Power Paint",
  },
  description: "A simple paint application built with Next.js and TypeScript.",
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: ReactNode;
  modal: ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages({ locale });
  const session = await auth();
  const timeZone = await getTimeZone();

  const isQueryDevtoolsEnabled =
    process.env.REACT_QUERY_DEVTOOLS_ENABLED === "true";

  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} ${interSans.variable} antialiased h-full`}
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex flex-col h-full">
        <QueryProvider isDevtoolsEnabled={isQueryDevtoolsEnabled}>
          <ClientProviders
            locale={locale}
            messages={messages}
            session={session}
            timeZone={timeZone}
          >
            <Header />
            <div className="grow flex flex-col">{children}</div>
            {modal}
          </ClientProviders>
          <SpeedInsights />
        </QueryProvider>
      </body>
    </html>
  );
}
