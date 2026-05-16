"use client";
// src/app/page.jsx  ← HOME PAGE (car grid + filters)
// Place this at: src/app/page.jsx
// The car detail page stays at: src/app/cars/[id]/page.jsx

import { useState, useEffect, useCallback, useMemo } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import CarCard from "../Components/CarCard";
import CarCardSkeleton from "../Components/CarCardSkeleton";
import FilterBar from "../Components/FilterBar";
import Translations from "./Translations";

const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const PAGE_SIZE = 12;

/* ── fetch all cars from Strapi ───────────────────────────────────── */
async function fetchCars() {
  const res = await fetch(
    `${STRAPI_BASE}/api/cars?populate=*&pagination[pageSize]=200`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error(`Strapi ${res.status}`);
  const json = await res.json();
  return (json.data || []).map(formatCar);
}

function buildImageUrl(raw) {
  if (!raw) return "/placeholder-car.jpg";
  if (raw.startsWith("http")) return raw;
  return `${STRAPI_BASE}${raw}`;
}

function formatCar(car) {
  // Strapi v5: fields are flat on car (no .attributes wrapper)
  // documentId is the string used in API routes, car.id is numeric (admin display only)
  const a = car.attributes || car;

  // Strapi v5: Image is a flat array [ { url, formats } ]
  // Strapi v4: Image.data[0].attributes.url
  // Use Strapi's auto-generated small format for card thumbnails (faster loading)
  const imageRaw =
    a.Image?.data?.[0]?.attributes?.formats?.small?.url ||  // v4 small
    a.Image?.data?.[0]?.attributes?.url ||                   // v4 full
    a.Image?.[0]?.formats?.small?.url ||                     // v5 small ✅
    a.Image?.[0]?.url ||                                     // v5 full
    null;

  return {
    // Use documentId for URL routing — Strapi v5 REST API requires it for /api/cars/:id
    id: car.documentId || car.id,
    make: a.Brand || "Unknown",
    makeAr: a.BrandAr || null,
    makeKu: a.BrandKu || null,
    model: a.Name || "Unknown",
    year: a.Year ? String(a.Year) : null,
    odometer: a.Kilometers
      ? `${Number(a.Kilometers).toLocaleString()} km`
      : null,
    price: a.Price ? Number(a.Price) : 0,
    priceFormatted: a.Price ? Number(a.Price).toLocaleString() : "—",
    priceCurrency: a.Currency || "$",
    image: buildImageUrl(imageRaw),
    transmission: a.Transmission || null,
    fuelType: a.FuelType || null,
    location: a.Location || "Iraq",
    type: a.Type || null,
    color: a.Color || null,
  };
}

/* ── derive unique filter options ────────────────────────────────── */
function unique(arr) {
  return [...new Set(arr.filter(Boolean))].sort();
}

/* ── Page Component ──────────────────────────────────────────────── */
export default function HomePage() {
  /* theme + lang */
  const [lang, setLang] = useState("en");
  const [theme, setTheme] = useState("light");
  const t = Translations[lang];
  const isRtl = lang === "ar" || lang === "ku";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [isRtl, lang]);

  const toggleTheme = useCallback(
    () => setTheme((p) => (p === "light" ? "dark" : "light")),
    []
  );

  /* data */
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchCars()
      .then(setCars)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  /* filters */
  const [searchTerm, setSearchTerm] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [transmission, setTransmission] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [page, setPage] = useState(1);

  const onReset = useCallback(() => {
    setSearchTerm("");
    setMake("");
    setModel("");
    setYear("");
    setMinPrice("");
    setMaxPrice("");
    setTransmission("");
    setFuelType("");
    setPage(1);
  }, []);

  /* derived filter options */
  const makes = useMemo(() => unique(cars.map((c) => c.make)), [cars]);
  const models = useMemo(
    () => unique(cars.filter((c) => !make || c.make === make).map((c) => c.model)),
    [cars, make]
  );
  const years = useMemo(() => unique(cars.map((c) => c.year)), [cars]);
  const transmissions = useMemo(
    () => unique(cars.map((c) => c.transmission)),
    [cars]
  );
  const fuelTypes = useMemo(() => unique(cars.map((c) => c.fuelType)), [cars]);

  /* filtered results */
  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return cars.filter((c) => {
      if (q && !`${c.make} ${c.model}`.toLowerCase().includes(q)) return false;
      if (make && c.make !== make) return false;
      if (model && c.model !== model) return false;
      if (year && c.year !== year) return false;
      if (minPrice && c.price < Number(minPrice)) return false;
      if (maxPrice && c.price > Number(maxPrice)) return false;
      if (transmission && c.transmission !== transmission) return false;
      if (fuelType && c.fuelType !== fuelType) return false;
      return true;
    });
  }, [cars, searchTerm, make, model, year, minPrice, maxPrice, transmission, fuelType]);

  /* pagination */
  const visible = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page]);
  const hasMore = visible.length < filtered.length;

  /* reset page when filters change */
  useEffect(() => setPage(1), [searchTerm, make, model, year, minPrice, maxPrice, transmission, fuelType]);

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-300"
      >
        <div className="max-w-6xl mx-auto w-full min-h-screen flex flex-col bg-[var(--bg)] border-x border-[var(--border)]">

          <Header
            lang={lang}
            setLang={setLang}
            theme={theme}
            toggleTheme={toggleTheme}
            t={t}
          />

          <main className="px-6 md:px-10 py-8 flex-1 flex flex-col">

            <FilterBar
              t={t}
              searchTerm={searchTerm} setSearchTerm={setSearchTerm}
              make={make} setMake={setMake}
              model={model} setModel={setModel}
              year={year} setYear={setYear}
              minPrice={minPrice} setMinPrice={setMinPrice}
              maxPrice={maxPrice} setMaxPrice={setMaxPrice}
              transmission={transmission} setTransmission={setTransmission}
              fuelType={fuelType} setFuelType={setFuelType}
              makes={makes}
              models={models}
              years={years}
              transmissions={transmissions}
              fuelTypes={fuelTypes}
              onReset={onReset}
            />

            {/* Error state */}
            {error && !loading && (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-red-500">
                  Could not load cars: {error}. Is Strapi running at{" "}
                  <code className="font-mono">{STRAPI_BASE}</code>?
                </p>
              </div>
            )}

            {/* Loading skeletons */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <CarCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && filtered.length === 0 && (
              <div className="flex flex-1 items-center justify-center text-[var(--text-muted)] text-sm">
                {t.noResults}
              </div>
            )}

            {/* Car grid */}
            {!loading && !error && visible.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {visible.map((car, i) => (
                    <CarCard key={car.id} car={car} lang={lang} index={i} t={t} />
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      className="px-8 py-3 rounded-xl font-bold text-sm text-white
                        hover:opacity-90 active:scale-[.98] transition-all"
                      style={{ background: "var(--accent)" }}
                    >
                      {t.loadMore}
                    </button>
                  </div>
                )}
              </>
            )}
          </main>

          <Footer t={t} />
        </div>
      </div>
    </div>
  );
}