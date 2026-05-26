"use client";
// src/app/components/FilterBar.jsx
import React, { useRef, useState } from "react";

/* ── Brand logos ─────────────────────────────────────────────────── */
const BRANDS = [
  { name: "Toyota", logo: "https://www.carlogos.org/car-logos/toyota-logo-2019-3700x1200.png" },
  { name: "Mercedes", logo: "https://www.carlogos.org/car-logos/mercedes-benz-logo-2011-1920x1080.png" },
  { name: "Kia", logo: "https://www.carlogos.org/car-logos/kia-logo-2021-download.png" },
  { name: "BYD", logo: "https://www.carlogos.org/car-logos/byd-logo-2023-download.png" },
  { name: "BMW", logo: "https://www.carlogos.org/car-logos/bmw-logo-2020-download.png" },
  { name: "Hyundai", logo: "https://www.carlogos.org/car-logos/hyundai-logo-2011-download.png" },
  { name: "Nissan", logo: "https://www.carlogos.org/car-logos/nissan-logo-2020-download.png" },
  { name: "Honda", logo: "https://www.carlogos.org/car-logos/honda-logo-2000-full.png" },
  { name: "Volkswagen", logo: "https://www.carlogos.org/car-logos/volkswagen-logo-2019-download.png" },
  { name: "Tesla", logo: "https://www.carlogos.org/car-logos/tesla-logo-2007-download.png" },
];

const IRAQ_CITIES = [
  "Baghdad", "Erbil", "Sulaymaniyah", "Duhok", "Mosul",
  "Basra", "Kirkuk", "Najaf", "Karbala", "Nasiriyah",
];

const MILEAGE_OPTIONS = [
  "Under 10,000 km", "10,000 – 50,000 km", "50,000 – 100,000 km",
  "100,000 – 150,000 km", "Over 150,000 km",
];

const PRICE_OPTIONS = [
  "Under $5,000", "$5,000 – $15,000", "$15,000 – $30,000",
  "$30,000 – $60,000", "Over $60,000",
];

/* ── Icons ───────────────────────────────────────────────────────── */
const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    className="w-4 h-4 shrink-0" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

const ChevronDown = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    className={className} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    className="w-5 h-5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    className="w-4 h-4 shrink-0" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <path strokeLinecap="round" d="m21 21-4.35-4.35" />
  </svg>
);

/* ── Custom Dropdown ─────────────────────────────────────────────── */
function Dropdown({ label, value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  React.useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full text-left px-4 py-3 flex flex-col gap-0.5 group"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          {label}
        </span>
        <span className={`text-sm font-medium flex items-center justify-between gap-2 ${value ? "text-[var(--text)]" : "text-[var(--text-muted)]"}`}>
          <span className="truncate">{value || placeholder}</span>
          <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </span>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50
          bg-[var(--bg-card)] border border-[var(--border)] rounded-xl
          shadow-[0_8px_32px_rgba(0,0,0,0.18)] overflow-hidden py-1 min-w-[180px]">
          <button
            onClick={() => { onChange(""); setOpen(false); }}
            className="w-full text-left px-4 py-2.5 text-sm text-[var(--text-muted)]
              hover:bg-[var(--bg-subtle)] transition-colors"
          >
            {placeholder}
          </button>
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                ${value === opt
                  ? "text-[var(--accent)] bg-[var(--bg-subtle)] font-semibold"
                  : "text-[var(--text)] hover:bg-[var(--bg-subtle)]"
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main FilterBar — desktop only (hidden on mobile) ───────────── */
export default function FilterBar({
  t,
  searchTerm, setSearchTerm,
  make, setMake,
  model, setModel,
  year, setYear,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  transmission, setTransmission,
  fuelType, setFuelType,
  makes, models, years, transmissions, fuelTypes,
  onReset,
  totalCount = 0,
}) {
  const [city, setCity] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const [mileage, setMileage] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const cityRef = useRef(null);
  const brandsRef = useRef(null);

  React.useEffect(() => {
    function handleClick(e) {
      if (cityRef.current && !cityRef.current.contains(e.target)) setCityOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const scrollBrands = () => {
    if (brandsRef.current) {
      brandsRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const allYearOptions = years.length > 0
    ? years
    : Array.from({ length: 20 }, (_, i) => String(2025 - i));

  return (
    /* hidden on mobile — SearchModal handles mobile filtering */
    <section
      className="hidden md:block mb-8 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl
        overflow-hidden shadow-[var(--shadow-sm)]"
      aria-label="Search and filter cars"
    >
      {/* ── Row 1: Location ── */}
      <div className="flex items-center px-5 pt-4 pb-3 border-b border-[var(--border)]">
        <div ref={cityRef} className="relative">
          <button
            onClick={() => setCityOpen(v => !v)}
            className="flex items-center gap-2 text-sm font-semibold
              text-[var(--text)] hover:text-[var(--accent)] transition-colors
              border border-[var(--border)] rounded-lg px-3 py-2
              bg-[var(--bg-subtle)] hover:border-[var(--accent)]"
            aria-haspopup="listbox"
            aria-expanded={cityOpen}
          >
            <PinIcon />
            <span>Iraq{city ? ` – ${city}` : " – Select city"}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${cityOpen ? "rotate-180" : ""}`} />
          </button>

          {cityOpen && (
            <div className="absolute top-full left-0 mt-1 z-50 w-52
              bg-[var(--bg-card)] border border-[var(--border)] rounded-xl
              shadow-[0_8px_32px_rgba(0,0,0,0.18)] overflow-hidden py-1">
              <button
                onClick={() => { setCity(""); setCityOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-[var(--text-muted)]
                  hover:bg-[var(--bg-subtle)] transition-colors"
              >
                All Iraq
              </button>
              {IRAQ_CITIES.map(c => (
                <button
                  key={c}
                  onClick={() => { setCity(c); setCityOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                    ${city === c
                      ? "text-[var(--accent)] bg-[var(--bg-subtle)] font-semibold"
                      : "text-[var(--text)] hover:bg-[var(--bg-subtle)]"
                    }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Row 2: Brand Logos ── */}
      <div className="relative px-5 py-4 border-b border-[var(--border)]">
        <div
          ref={brandsRef}
          className="flex items-center gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {BRANDS.map(brand => (
            <button
              key={brand.name}
              onClick={() => setMake(make === brand.name ? "" : brand.name)}
              title={brand.name}
              className={`shrink-0 w-[88px] h-[60px] rounded-xl border-2 transition-all duration-200
                flex items-center justify-center p-3 bg-[var(--bg-card)]
                hover:border-[var(--accent)] hover:shadow-md
                ${make === brand.name
                  ? "border-[var(--accent)] shadow-md bg-[var(--bg-subtle)]"
                  : "border-[var(--border)]"
                }`}
              aria-label={brand.name}
              aria-pressed={make === brand.name}
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="max-h-full max-w-full object-contain dark:invert"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
              <span className="hidden text-xs font-bold text-[var(--text)]">
                {brand.name}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={scrollBrands}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10
            w-9 h-9 rounded-full bg-[var(--bg-card)] border border-[var(--border)]
            flex items-center justify-center shadow-md
            hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors
            text-[var(--text-muted)]"
          aria-label="Scroll brands right"
        >
          <ChevronRight />
        </button>
      </div>

      {/* ── Row 3: Main Dropdowns + Search Button ── */}
      <div className="flex items-stretch divide-x divide-[var(--border)]">
        <Dropdown
          label="Model"
          value={model}
          onChange={setModel}
          options={models.length > 0 ? models : ["Camry", "Corolla", "Land Cruiser", "Yaris"]}
          placeholder="Select"
        />
        <Dropdown
          label="Year"
          value={year}
          onChange={setYear}
          options={allYearOptions}
          placeholder="Select"
        />
        <Dropdown
          label="Mileage"
          value={mileage}
          onChange={setMileage}
          options={MILEAGE_OPTIONS}
          placeholder="Select"
        />
        <Dropdown
          label="Price"
          value={priceRange}
          onChange={setPriceRange}
          options={PRICE_OPTIONS}
          placeholder="Select"
        />

        <div className="flex items-center px-4 py-3 shrink-0">
          <button
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm
              text-white hover:opacity-90 active:scale-[.98] transition-all whitespace-nowrap"
            style={{ background: "var(--accent)" }}
            aria-label="Show cars"
          >
            <SearchIcon />
            Show{totalCount > 0 ? ` ${totalCount.toLocaleString()}` : ""} Cars
          </button>
        </div>
      </div>
    </section>
  );
}