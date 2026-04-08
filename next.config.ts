import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  reactCompiler: false,
  poweredByHeader: false,
  typedRoutes: false,
  experimental: {
    authInterrupts: true,
    optimizeServerReact: true,
  },
  images: {
    formats: ["image/webp"],
    dangerouslyAllowLocalIP: true,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 365 * 24 * 60 * 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: new URL(process.env.NEXT_PUBLIC_BASE_URL!).hostname,
      },
    ],
    qualities: [25, 50, 75, 100],
  },
};

const withNextIntl = createNextIntlPlugin({
  requestConfig: "./src/shared/i18n/request.ts",
});

export default withNextIntl(nextConfig);
