// src/app/sitemap.js
// Dynamic sitemap — Next.js App Router (PRD §3: SEO)
// Fetches all car IDs from Strapi and generates clean URLs

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://iqcars.io";
const STRAPI   = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export default async function sitemap() {
  // Static routes
  const staticRoutes = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily",  priority: 1 },
    { url: `${BASE_URL}/about`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  // Dynamic car routes
  try {
    const res  = await fetch(`${STRAPI}/api/cars?fields=id,updatedAt&pagination[pageSize]=1000`);
    const json = await res.json();
    const carRoutes = (json.data || []).map((car) => ({
      url:             `${BASE_URL}/cars/${car.id}`,
      lastModified:    car.updatedAt ? new Date(car.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority:        0.8,
    }));
    return [...staticRoutes, ...carRoutes];
  } catch {
    return staticRoutes;
  }
}
