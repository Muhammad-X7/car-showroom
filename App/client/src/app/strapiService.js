// src/app/strapiService.js
// All Strapi API calls in one place — easy to swap for a different backend

const BASE = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

function buildImageUrl(raw) {
  if (!raw) return "/placeholder-car.jpg";
  if (raw.startsWith("http")) return raw;
  return `${BASE}${raw}`;
}

function formatCar(car) {
  // Strapi v5 flattens attributes; v4 nests under .attributes
  const a = car.attributes || car;

  // Image: Strapi v5 returns array directly; v4 wraps in .data
  const imageRaw =
    a.Image?.data?.[0]?.attributes?.url ||
    a.Image?.[0]?.url ||
    null;

  // Additional gallery images
  const galleryRaw = (
    a.Image?.data?.slice(1)?.map(i => i?.attributes?.url) ||
    a.Image?.slice(1)?.map(i => i?.url) ||
    []
  );

  return {
    id: car.id,
    make: a.Brand || "Unknown",
    makeAr: a.BrandAr || null,
    makeKu: a.BrandKu || null,
    model: a.Name || "Unknown",
    year: a.Year ? String(a.Year) : null,
    odometer: a.Kilometers ? `${Number(a.Kilometers).toLocaleString()} km` : null,
    price: a.Price || null,
    priceFormatted: a.Price ? Number(a.Price).toLocaleString() : "—",
    priceCurrency: a.Currency || "$",
    image: buildImageUrl(imageRaw),
    gallery: galleryRaw.map(buildImageUrl),
    trim: a.Trim || null,
    transmission: a.Transmission || null,
    fuelType: a.FuelType || null,
    location: a.Location || "Iraq",
    type: a.Type || null,        // 'freePlate' | 'privateSeller' | null
    description: a.Description || null,
    color: a.Color || null,
    engineSize: a.EngineSize || null,
    doors: a.Doors || null,
    phone: a.Phone || null,
    slug: a.slug || String(car.id),
  };
}

export async function fetchCars() {
  try {
    const res = await fetch(`${BASE}/api/cars?populate=*&pagination[pageSize]=100`, {
      next: { revalidate: 60 },  // ISR — revalidate every 60s
    });
    if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
    const json = await res.json();
    return (json.data || []).map(formatCar);
  } catch (err) {
    console.error("fetchCars failed:", err);
    return [];
  }
}

export async function fetchCarById(id) {
  try {
    const res = await fetch(`${BASE}/api/cars/${id}?populate=*`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
    const json = await res.json();
    return json.data ? formatCar(json.data) : null;
  } catch (err) {
    console.error("fetchCarById failed:", err);
    return null;
  }
}