/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
      },
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com', // Allows Cloudflare backend endpoints
      },
      {
        protocol: 'https',
        hostname: '**.r2.dev', // Allows Cloudflare public buckets
      }
    ],
  },
};

export default nextConfig;