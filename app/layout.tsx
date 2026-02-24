import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import {
  ClientProviders,
  QueryProvider,
  ServerProviders,
} from "@/app/providers";
import { ThemeScript } from "@/features/theme-switcher/ui/ThemeScript";
import { getSession } from "@/shared/lib/auth";
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
  const session = await getSession();

  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} ${interSans.variable} antialiased`}
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <ServerProviders>
          <QueryProvider>
            <ClientProviders session={session}>
              <Header />
              {children}
            </ClientProviders>
          </QueryProvider>
        </ServerProviders>
      </body>
    </html>
  );
}
