"use client";
// src/app/components/SearchModal.jsx
// Mobile-only search modal — shown when the Search button in the header is tapped

import React, { useRef, useState, useEffect } from "react";

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

const MILEAGE_OPTIONS = [
  "Under 10,000 km", "10,000 – 50,000 km", "50,000 – 100,000 km",
  "100,000 – 150,000 km", "Over 150,000 km",
];

const PRICE_OPTIONS = [
  "Under $5,000", "$5,000 – $15,000", "$15,000 – $30,000",
  "$30,000 – $60,000", "Over $60,000",
];

/* ── Icons ── */
const ChevronDown = ({ open }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    className="w-4 h-4 shrink-0" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <path strokeLinecap="round" d="m21 21-4.35-4.35" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    className="w-5 h-5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    className="w-5 h-5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
  </svg>
);

/* ── Dropdown ── */
function Dropdown({ label, value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl
          border border-[var(--border)] bg-[var(--bg-subtle)]
          text-sm font-medium text-[var(--text)] transition-colors
          hover:border-[var(--accent)]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={value ? "text-[var(--text)]" : "text-[var(--text-muted)]"}>
          {value || label}
        </span>
        <ChevronDown open={open} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-[60]
          bg-[var(--bg-card)] border border-[var(--border)] rounded-xl
          shadow-[0_8px_32px_rgba(0,0,0,0.22)] overflow-hidden py-1 max-h-52 overflow-y-auto">
          <button
            onClick={() => { onChange(""); setOpen(false); }}
            className="w-full text-left px-4 py-2.5 text-sm text-[var(--text-muted)]
              hover:bg-[var(--bg-subtle)] transition-colors"
          >
            {placeholder || label}
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

/* ── SearchModal ── */
export default function SearchModal({
  open,
  onClose,
  make, setMake,
  model, setModel,
  year, setYear,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  transmission, setTransmission,
  fuelType, setFuelType,
  models, years, transmissions, fuelTypes,
  totalCount,
  t,
}) {
  const brandsRef = useRef(null);
  const [mileage, setMileage] = useState("");
  const [priceRange, setPriceRange] = useState("");

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const scrollBrands = () => {
    if (brandsRef.current) {
      brandsRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const allYearOptions = years.length > 0
    ? years
    : Array.from({ length: 20 }, (_, i) => String(2025 - i));

  if (!open) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 bg-black/60 flex flex-col justify-end md:hidden"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label="Search cars"
    >
      {/* Panel — stops click propagation so backdrop click closes but panel click doesn't */}
      <div
        className="bg-[var(--bg-card)] rounded-t-2xl w-full max-h-[92dvh] flex flex-col
          animate-slide-up overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] shrink-0">
          <span className="text-base font-bold text-[var(--text)]"
            style={{ fontFamily: "var(--font-display)" }}>
            Search
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)]
              hover:bg-[var(--bg-subtle)] transition-colors"
            aria-label="Close search"
          >
            <XIcon />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4">

          {/* Brand logos */}
          <div className="relative">
            <div
              ref={brandsRef}
              className="grid gap-2"
              style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
            >
              {BRANDS.map(brand => (
                <button
                  key={brand.name}
                  onClick={() => setMake(make === brand.name ? "" : brand.name)}
                  title={brand.name}
                  className={`h-[56px] rounded-xl border-2 transition-all duration-200
                    flex items-center justify-center p-2 bg-[var(--bg-card)]
                    hover:border-[var(--accent)]
                    ${make === brand.name
                      ? "border-[var(--accent)] bg-[var(--bg-subtle)]"
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
                  <span className="hidden text-[10px] font-bold text-[var(--text)]">
                    {brand.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Dropdowns — 2-column grid */}
          <div className="grid grid-cols-2 gap-3">
            <Dropdown
              label="Model"
              value={model}
              onChange={setModel}
              options={models.length > 0 ? models : ["Camry", "Corolla", "Land Cruiser", "Yaris"]}
              placeholder="All Models"
            />
            <Dropdown
              label="Year"
              value={year}
              onChange={setYear}
              options={allYearOptions}
              placeholder="All Years"
            />
            <Dropdown
              label="Min Mileage"
              value={mileage}
              onChange={setMileage}
              options={MILEAGE_OPTIONS}
              placeholder="Min Mileage"
            />
            <Dropdown
              label="Max Mileage"
              value={mileage}
              onChange={setMileage}
              options={MILEAGE_OPTIONS}
              placeholder="Max Mileage"
            />
            <Dropdown
              label="Min Price"
              value={priceRange}
              onChange={setPriceRange}
              options={PRICE_OPTIONS}
              placeholder="Min Price"
            />
            <Dropdown
              label="Max Price"
              value={priceRange}
              onChange={setPriceRange}
              options={PRICE_OPTIONS}
              placeholder="Max Price"
            />
          </div>

          {/* Transmission */}
          <Dropdown
            label="Transmission"
            value={transmission}
            onChange={setTransmission}
            options={transmissions}
            placeholder="All Transmissions"
          />

          {/* Fuel Type */}
          <Dropdown
            label="Fuel Type"
            value={fuelType}
            onChange={setFuelType}
            options={fuelTypes}
            placeholder="All Fuel Types"
          />

        </div>

        {/* Footer: Show Cars button */}
        <div className="px-5 py-4 border-t border-[var(--border)] shrink-0">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl
              font-bold text-base text-white hover:opacity-90 active:scale-[.98] transition-all"
            style={{ background: "var(--accent)" }}
          >
            <SearchIcon />
            Show{totalCount > 0 ? ` ${totalCount.toLocaleString()}` : ""} Cars
          </button>
        </div>
      </div>
    </div>
  );
}
