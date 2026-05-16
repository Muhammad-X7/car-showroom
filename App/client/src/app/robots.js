// src/app/robots.js
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://iqcars.io";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Block Strapi admin panel from indexing if proxied
        disallow: ["/strapi-admin/", "/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
