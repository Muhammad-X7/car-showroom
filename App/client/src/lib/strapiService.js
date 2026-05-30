// src/lib/strapiService.js

const BASE = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

function buildImageUrl(raw) {
  if (!raw) return "/placeholder-car.jpg";
  if (raw.startsWith("http")) return raw;
  return `${BASE}${raw}`;
}

function formatCar(car, locale = "en") {
  const a = car.attributes || car;

  const imageRaw =
    a.Image?.data?.[0]?.attributes?.formats?.small?.url ||
    a.Image?.data?.[0]?.attributes?.url ||
    a.Image?.[0]?.formats?.small?.url ||
    a.Image?.[0]?.url ||
    null;

  const galleryRaw =
    a.Image?.data?.slice(1)?.map((i) => i?.attributes?.url) ||
    a.Image?.slice(1)?.map((i) => i?.url) ||
    [];

  // Localized brand name fallback chain
  const brandByLocale = {
    ar: a.BrandAr || a.Brand || "غير معروف",
    ckb: a.BrandKu || a.Brand || "نەزانراو",
    en: a.Brand || "Unknown",
  };

  // Localized model name fallback chain
  const nameByLocale = {
    ar: a.NameAr || a.Name || "غير معروف",
    ckb: a.NameKu || a.Name || "نەزانراو",
    en: a.Name || "Unknown",
  };

  return {
    id: car.documentId || car.id,
    make: brandByLocale[locale] ?? brandByLocale.en,
    model: nameByLocale[locale] ?? nameByLocale.en,
    year: a.Year ? String(a.Year) : null,
    odometer: a.Kilometers
      ? `${Number(a.Kilometers).toLocaleString()} km`
      : null,
    price: a.Price ? Number(a.Price) : 0,
    priceFormatted: a.Price ? Number(a.Price).toLocaleString() : "—",
    priceCurrency: a.Currency || "$",
    image: buildImageUrl(imageRaw),
    gallery: galleryRaw.map(buildImageUrl),
    trim: a.Trim || null,
    transmission: a.Transmission || null,
    fuelType: a.Fuel || null,
    location: a.ImportCountry || "Iraq",   // ImportCountry is the real location field
    type: a.Type || null,
    description: a.Description || null,
    color: a.Color || null,
    engineSize: a.EngineSize ? String(a.EngineSize) : null,
    // ── fields that were missing from the return object ──────────────
    cylinders: a.Cylinders ? String(a.Cylinders) : null,
    condition: a.Condition || null,
    paintParts: a.PaintParts || null,
    importCountry: a.ImportCountry || null,
    plate: a.Plate || null,
    seatNumber: a.SeatNumber ? String(a.SeatNumber) : null,
    seatMaterial: a.SeatMaterial || null,
    // ── kept for forward-compat if added to schema later ─────────────
    doors: a.Doors ? String(a.Doors) : null,
    phone: a.Phone || null,
    slug: a.slug || String(car.documentId || car.id),
  };
}

export async function fetchCars(locale = "ar") {
  try {
    const res = await fetch(
      `${BASE}/api/cars?populate=*&locale=${locale}&pagination[pageSize]=200`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
    const json = await res.json();
    return (json.data || []).map((car) => formatCar(car, locale));
  } catch (err) {
    console.error("fetchCars failed:", err);
    return [];
  }
}

export async function fetchCarById(id, locale = "ar") {
  try {
    const res = await fetch(
      `${BASE}/api/cars/${id}?populate=*&locale=${locale}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
    const json = await res.json();
    return json.data ? formatCar(json.data, locale) : null;
  } catch (err) {
    console.error("fetchCarById failed:", err);
    return null;
  }
}