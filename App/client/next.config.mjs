import createNextIntlPlugin from "next-intl/plugin";

// 1. Initialize the plugin with the path to your i18n file
const withNextIntl = createNextIntlPlugin("./i18n.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.r2.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.eu.r2.cloudflarestorage.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    // Extracts and inlines critical CSS to eliminate render-blocking
    // stylesheet requests — saves ~120ms on first paint.
    optimizeCss: true,
  },
};

// 2. Wrap and export the config
export default withNextIntl(nextConfig);