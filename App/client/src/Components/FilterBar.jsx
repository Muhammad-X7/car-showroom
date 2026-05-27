"use client";
// src/app/components/FilterBar.jsx
// Desktop-only filter bar (hidden on mobile — SearchModal handles mobile).

import React, { useRef, useState } from "react";
import { BRANDS, IRAQ_CITIES, MILEAGE_OPTIONS, PRICE_OPTIONS } from "./searchConstants";
import { PinIcon, SearchIcon, ChevronDownIcon, ChevronRightIcon } from "./Icons";
import SearchDropdown from "./SearchDropdown";

/* ── Brand logo strip ────────────────────────────────────────────── */
function BrandStrip({ make, setMake }) {
  const brandsRef = useRef(null);

  const scrollBrands = () => {
    if (brandsRef.current) {
      brandsRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="relative px-5 py-4 border-b border-[var(--border)]">
      <div
        ref={brandsRef}
        className="flex items-center gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {BRANDS.map((brand) => (
          <button
            key={brand.name}
            onClick={() => setMake(make === brand.name ? "" : brand.name)}
            title={brand.name}
            className={`shrink-0 w-[88px] h-[60px] rounded-xl border-2 transition-all duration-200
              flex items-center justify-center p-3 bg-[#aba9a9c3]
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
              className="max-h-full max-w-full object-contain"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <span className="hidden text-xs font-bold text-[var(--text)]">{brand.name}</span>
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
        <ChevronRightIcon />
      </button>
    </div>
  );
}

/* ── City picker ─────────────────────────────────────────────────── */
function CityPicker({ city, setCity }) {
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
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm font-semibold
          text-[var(--text)] hover:text-[var(--accent)] transition-colors
          border border-[var(--border)] rounded-lg px-3 py-2
          bg-[var(--bg-subtle)] hover:border-[var(--accent)]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <PinIcon className="w-4 h-4" />
        <span>Iraq{city ? ` – ${city}` : " – Select city"}</span>
        <ChevronDownIcon open={open} className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 w-52
          bg-[var(--bg-card)] border border-[var(--border)] rounded-xl
          shadow-[0_8px_32px_rgba(0,0,0,0.18)] overflow-hidden py-1">
          <button
            onClick={() => { setCity(""); setOpen(false); }}
            className="w-full text-left px-4 py-2.5 text-sm text-[var(--text-muted)]
              hover:bg-[var(--bg-subtle)] transition-colors"
          >
            All Iraq
          </button>
          {IRAQ_CITIES.map((c) => (
            <button
              key={c}
              onClick={() => { setCity(c); setOpen(false); }}
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
  );
}

/* ── FilterBar ───────────────────────────────────────────────────── */
export default function FilterBar({
  t,
  searchTerm, setSearchTerm,
  make, setMake,
  model, setModel,
  year, setYear,
  city, setCity,
  minMileage, setMinMileage,
  maxMileage, setMaxMileage,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  transmission, setTransmission,
  fuelType, setFuelType,
  models, years, transmissions, fuelTypes,
  onReset,
  totalCount = 0,
}) {
  const allYearOptions = years.length > 0
    ? years
    : Array.from({ length: 20 }, (_, i) => String(2025 - i));

  return (
    <section
      className="hidden md:block mb-8 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl
        overflow-hidden shadow-[var(--shadow-sm)]"
      aria-label="Search and filter cars"
    >
      {/* ── Row 1: Location + text search ── */}
      <div className="flex items-center gap-4 px-5 pt-4 pb-3 border-b border-[var(--border)]">
        <CityPicker city={city} setCity={setCity} />

        {/* Text search input */}
        <div className="flex items-center gap-2 flex-1 max-w-xs
          border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--bg-subtle)]
          focus-within:border-[var(--accent)] transition-colors">
          <SearchIcon className="w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search make or model…"
            className="flex-1 text-sm bg-transparent text-[var(--text)] placeholder:text-[var(--text-muted)]
              outline-none border-none"
            aria-label="Search cars by make or model"
          />
        </div>
      </div>

      {/* ── Row 2: Brand logos ── */}
      <BrandStrip make={make} setMake={setMake} />

      {/* ── Row 3: Dropdowns + Show button ── */}
      <div className="flex items-stretch divide-x divide-[var(--border)]">
        <SearchDropdown
          label="Model" value={model} onChange={setModel}
          options={models.length > 0 ? models : ["Camry", "Corolla", "Land Cruiser", "Yaris"]}
          placeholder="Select" variant="desktop"
        />
        <SearchDropdown
          label="Year" value={year} onChange={setYear}
          options={allYearOptions}
          placeholder="Select" variant="desktop"
        />
        <SearchDropdown
          label="Min Mileage" value={minMileage} onChange={setMinMileage}
          options={MILEAGE_OPTIONS}
          placeholder="Select" variant="desktop"
        />
        <SearchDropdown
          label="Max Mileage" value={maxMileage} onChange={setMaxMileage}
          options={MILEAGE_OPTIONS}
          placeholder="Select" variant="desktop"
        />
        <SearchDropdown
          label="Min Price" value={minPrice} onChange={setMinPrice}
          options={PRICE_OPTIONS}
          placeholder="Select" variant="desktop"
        />
        <SearchDropdown
          label="Max Price" value={maxPrice} onChange={setMaxPrice}
          options={PRICE_OPTIONS}
          placeholder="Select" variant="desktop"
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