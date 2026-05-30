"use client";
// src/app/components/FilterBar.jsx
// Desktop-only filter bar (hidden on mobile — SearchModal handles mobile).
// Composes smaller focused components; no logic lives here.

import React from "react";
import { MILEAGE_OPTIONS, PRICE_OPTIONS } from "./searchConstants";
import SearchDropdown from "./SearchDropdown";
import BrandStrip from "./BrandStrip";
import DesktopModelDropdown from "./DesktopModelDropdown";
import DesktopYearDropdown from "./DesktopYearDropdown";
import FilterBarActions from "./FilterBarActions";

export default function FilterBar({
  t,
  make, setMake,
  model, setModel,
  year, setYear,
  city, setCity,
  mileage, setMileage,
  price, setPrice,
  models, years,
  onReset,
  totalCount = 0,
}) {
  const allYearOptions = years.length > 0
    ? years
    : Array.from({ length: 20 }, (_, i) => String(2025 - i));

  const hasFilters = !!(make || model || year || city || mileage || price);

  return (
    <section
      className="hidden md:block mb-8 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl
        overflow-visible shadow-[var(--shadow-sm)]"
      aria-label="Search and filter cars"
    >
      {/* ── Row 1: City picker + Brand logos ── */}
      <BrandStrip make={make} setMake={setMake} city={city} setCity={setCity} />

      {/* ── Row 2: 4 dropdowns + Reset + Show button ── */}
      <div className="flex items-stretch divide-x divide-[var(--border)] overflow-visible">

        {/* Model — searchable desktop dropdown */}
        <DesktopModelDropdown
          value={model}
          onChange={setModel}
          options={models.length > 0 ? models : ["Camry", "Corolla", "Land Cruiser", "Yaris"]}
        />

        {/* Year — From / To range picker */}
        <DesktopYearDropdown
          value={year}
          onChange={setYear}
          options={allYearOptions}
        />

        {/* Mileage */}
        <SearchDropdown
          label="Mileage" value={mileage} onChange={setMileage}
          options={MILEAGE_OPTIONS}
          placeholder="Select" variant="desktop"
        />

        {/* Price */}
        <SearchDropdown
          label="Price" value={price} onChange={setPrice}
          options={PRICE_OPTIONS}
          placeholder="Select" variant="desktop"
        />

        {/* Reset + Show Cars */}
        <FilterBarActions
          hasFilters={hasFilters}
          onReset={onReset}
          totalCount={totalCount}
        />
      </div>
    </section>
  );
}
