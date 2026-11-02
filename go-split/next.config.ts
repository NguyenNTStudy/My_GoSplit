import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import { securityHeaders } from "./src/lib/security-headers";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  headers: async () => securityHeaders(),
  experimental: {
    agentFeedback: true,
  },
  images: {
    // Plan photos load fast on phones (task 6).
    formats: ["image/avif", "image/webp"],
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
