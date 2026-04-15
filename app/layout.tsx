// import { Analytics } from "@vercel/analytics/next";
// import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { getLocale, getMessages, getTimeZone } from "next-intl/server";
import type { ReactNode } from "react";

import { auth } from "@/shared/auth";

import { ThemeScript } from "@/features/switch-theme/ui/ThemeScript";

import { Header } from "@/widgets/header";

import { ClientProviders, QueryProvider } from "@/app/providers";

import { geistMono, geistSans, interSans } from "./fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Power Paint",
    default: "Power Paint",
  },
  icons: {
    icon: "/assets/icon.png",
  },
  keywords: [
    "paint",
    "drawing",
    "canvas",
    "collaboration",
    "next.js",
    "typescript",
  ],
  robots: {
    index: true,
    follow: true,
  },
  category: "painting application",
  applicationName: "Power Paint",
  creator: "Wo0zZ1",
  openGraph: {
    title: "Power Paint",
    description:
      "A simple paint application built with Next.js and TypeScript.",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "Power Paint",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/assets/power-paint-logo.png`,
        alt: "Power Paint Open Graph Image",
      },
    ],
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
  const [locale, messages, session, timeZone] = await Promise.all([
    getLocale(),
    getMessages(),
    auth(),
    getTimeZone(),
  ]);

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
          {/* <SpeedInsights /> */}
          {/* <Analytics /> */}
        </QueryProvider>
      </body>
    </html>
  );
}
