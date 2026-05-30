// src/app/[locale]/page.jsx  ← SERVER COMPONENT
import HomeClient from "./HomeClient";

const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

function buildImageUrl(raw) {
    if (!raw) return "/placeholder-car.jpg";
    if (raw.startsWith("http")) return raw;
    return `${STRAPI_BASE}${raw}`;
}

function formatCar(car) {
    const a = car.attributes || car;
    const imageRaw =
        a.Image?.data?.[0]?.attributes?.formats?.small?.url ||
        a.Image?.data?.[0]?.attributes?.url ||
        a.Image?.[0]?.formats?.small?.url ||
        a.Image?.[0]?.url ||
        null;

    return {
        id: car.documentId || car.id,
        make: a.Brand || "Unknown",
        makeAr: a.BrandAr || null,
        makeKu: a.BrandKu || null,
        model: a.Name || "Unknown",
        year: a.Year ? String(a.Year) : null,
        odometer: a.Kilometers ? `${Number(a.Kilometers).toLocaleString()} km` : null,
        price: a.Price ? Number(a.Price) : 0,
        priceFormatted: a.Price ? Number(a.Price).toLocaleString() : "—",
        priceCurrency: a.Currency || "$",
        image: buildImageUrl(imageRaw),
        transmission: a.Transmission || null,
        fuelType: a.Fuel || a.FuelType || null,
        location: a.Location || "Iraq",
        type: a.Type || null,
        color: a.Color || null,
    };
}

async function fetchCars() {
    const res = await fetch(
        `${STRAPI_BASE}/api/cars?populate=*&pagination[pageSize]=200`,
        { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error(`Strapi ${res.status}`);
    const json = await res.json();
    return (json.data || []).map(formatCar);
}

export default async function LocalePage() {
    let cars = [];
    let error = null;

    try {
        cars = await fetchCars();
    } catch (e) {
        error = e.message;
    }

    return <HomeClient initialCars={cars} initialError={error} />;
}