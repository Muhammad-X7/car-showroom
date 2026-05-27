"use client";
// src/app/components/SearchModal.jsx
// Mobile-only search modal — shown when the Search button in the header is tapped.

import React, { useRef, useEffect } from "react";
import { BRANDS, IRAQ_CITIES, MILEAGE_OPTIONS, PRICE_OPTIONS } from "./searchConstants";
import { SearchIcon, XIcon } from "./Icons";
import SearchDropdown from "./SearchDropdown";

/* ── SearchModal ─────────────────────────────────────────────────── */
export default function SearchModal({
  open,
  onClose,
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
  totalCount,
  t,
}) {
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

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
      {/* Panel */}
      <div
        className="bg-[var(--bg-card)] rounded-t-2xl w-full max-h-[92dvh] flex flex-col
          animate-slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
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

          {/* City picker — full-width dropdown */}
          <SearchDropdown
            label="City"
            value={city}
            onChange={setCity}
            options={IRAQ_CITIES}
            placeholder="All Iraq"
            variant="mobile"
          />

          {/* Brand logos — 4-column grid */}
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
          >
            {BRANDS.map((brand) => (
              <button
                key={brand.name}
                onClick={() => setMake(make === brand.name ? "" : brand.name)}
                title={brand.name}
                className={`h-[56px] rounded-xl border-2 transition-all duration-200
                  flex items-center justify-center p-2 bg-[#aba9a9c3]
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
                  className="max-h-full max-w-full object-contain"
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

          {/* Model + Year — 2-column grid */}
          <div className="grid grid-cols-2 gap-3">
            <SearchDropdown
              label="Model" value={model} onChange={setModel}
              options={models.length > 0 ? models : ["Camry", "Corolla", "Land Cruiser", "Yaris"]}
              placeholder="All Models" variant="mobile"
            />
            <SearchDropdown
              label="Year" value={year} onChange={setYear}
              options={allYearOptions}
              placeholder="All Years" variant="mobile"
            />
          </div>

          {/* Mileage — 2-column grid, separate min/max state */}
          <div className="grid grid-cols-2 gap-3">
            <SearchDropdown
              label="Min Mileage" value={minMileage} onChange={setMinMileage}
              options={MILEAGE_OPTIONS}
              placeholder="Min Mileage" variant="mobile"
            />
            <SearchDropdown
              label="Max Mileage" value={maxMileage} onChange={setMaxMileage}
              options={MILEAGE_OPTIONS}
              placeholder="Max Mileage" variant="mobile"
            />
          </div>

          {/* Price — 2-column grid, separate min/max state */}
          <div className="grid grid-cols-2 gap-3">
            <SearchDropdown
              label="Min Price" value={minPrice} onChange={setMinPrice}
              options={PRICE_OPTIONS}
              placeholder="Min Price" variant="mobile"
            />
            <SearchDropdown
              label="Max Price" value={maxPrice} onChange={setMaxPrice}
              options={PRICE_OPTIONS}
              placeholder="Max Price" variant="mobile"
            />
          </div>

          {/* Transmission */}
          <SearchDropdown
            label="Transmission" value={transmission} onChange={setTransmission}
            options={transmissions}
            placeholder="All Transmissions" variant="mobile"
          />

          {/* Fuel Type */}
          <SearchDropdown
            label="Fuel Type" value={fuelType} onChange={setFuelType}
            options={fuelTypes}
            placeholder="All Fuel Types" variant="mobile"
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