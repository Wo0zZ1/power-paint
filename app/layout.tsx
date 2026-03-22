import type { Metadata } from "next";
import { getLocale, getMessages, getTimeZone } from "next-intl/server";

import { ClientProviders, QueryProvider } from "@/app/providers";
import { ThemeScript } from "@/features/theme-switcher/ui/ThemeScript";
import { auth } from "@/shared/auth";
import { Header } from "@/widgets/header";

import { geistMono, geistSans, interSans } from "./fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Power Paint",
    default: "Power Paint",
  },
  description: "A simple paint application built with React and TypeScript.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages({ locale });
  const session = await auth();
  const timeZone = await getTimeZone();

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
        <QueryProvider>
          <ClientProviders
            locale={locale}
            messages={messages}
            session={session}
            timeZone={timeZone}
          >
            <Header />
            <div className="grow flex flex-col">{children}</div>
          </ClientProviders>
        </QueryProvider>
      </body>
    </html>
  );
}
