"use client";
// src/app/components/FilterBar.jsx
// Hick's Law: group controls into logical sections; limit top-level choices
// Postel's Law: search accepts messy input (trimmed + lowercased)
import React, { useCallback } from "react";

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none
      text-[var(--text-muted)]" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <path strokeLinecap="round" d="m21 21-4.35-4.35" />
  </svg>
);

const ResetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    className="w-4 h-4" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

const selectCls = `w-full text-sm font-medium bg-[var(--bg-card)] text-[var(--text)]
  border border-[var(--border)] rounded-lg px-3 py-2.5 cursor-pointer
  focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent
  appearance-none transition-colors hover:border-[var(--text-muted)]`;

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
}) {
  // Postel's Law: strip leading/trailing whitespace before storing
  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value.trimStart());
  }, [setSearchTerm]);

  const hasActiveFilters = searchTerm || make || model || year ||
    minPrice || maxPrice || transmission || fuelType;

  return (
    <section
      className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5
        shadow-[var(--shadow-sm)] mb-8"
      aria-label="Search and filter cars"
    >
      {/* Row 1: Search bar (Fitts' Law: large hit area, full width on mobile) */}
      <div className="relative mb-4">
        <SearchIcon />
        <input
          type="search"
          value={searchTerm}
          onChange={handleSearch}
          placeholder={t.searchPlaceholder}
          className="w-full text-sm bg-[var(--bg-card)] text-[var(--text)]
            border border-[var(--border)] rounded-lg pl-10 pr-4 py-2.5
            placeholder:text-[var(--text-muted)] focus:outline-none
            focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent
            transition-colors hover:border-[var(--text-muted)]"
          aria-label={t.searchPlaceholder}
        />
      </div>

      {/* Row 2: Filter dropdowns grid — Miller's Law: 4 controls max per row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">

        {/* Make */}
        <div className="relative">
          <label className="sr-only">{t.filterMake}</label>
          <select value={make} onChange={(e) => { setMake(e.target.value); setModel(""); }}
            className={selectCls} aria-label={t.filterMake}>
            <option value="">{t.allMakes}</option>
            {makes.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <ChevronDown />
        </div>

        {/* Model — progressive disclosure: only useful if make selected */}
        <div className="relative">
          <label className="sr-only">{t.filterModel}</label>
          <select value={model} onChange={(e) => setModel(e.target.value)}
            className={`${selectCls} ${!make ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!make} aria-label={t.filterModel}>
            <option value="">{t.allModels}</option>
            {models.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <ChevronDown />
        </div>

        {/* Year */}
        <div className="relative">
          <label className="sr-only">{t.filterYear}</label>
          <select value={year} onChange={(e) => setYear(e.target.value)}
            className={selectCls} aria-label={t.filterYear}>
            <option value="">{t.allYears}</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <ChevronDown />
        </div>

        {/* Transmission */}
        <div className="relative">
          <label className="sr-only">{t.filterTransmission}</label>
          <select value={transmission} onChange={(e) => setTransmission(e.target.value)}
            className={selectCls} aria-label={t.filterTransmission}>
            <option value="">{t.filterTransmission}</option>
            {transmissions.map((tr) => <option key={tr} value={tr}>{tr}</option>)}
          </select>
          <ChevronDown />
        </div>

        {/* Min Price */}
        <div>
          <label className="sr-only">{t.filterMinPrice}</label>
          <input
            type="number" min="0" placeholder={t.filterMinPrice}
            value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
            className="w-full text-sm bg-[var(--bg-card)] text-[var(--text)]
              border border-[var(--border)] rounded-lg px-3 py-2.5
              placeholder:text-[var(--text-muted)] focus:outline-none
              focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent
              transition-colors hover:border-[var(--text-muted)]"
            aria-label={t.filterMinPrice}
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="sr-only">{t.filterMaxPrice}</label>
          <input
            type="number" min="0" placeholder={t.filterMaxPrice}
            value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full text-sm bg-[var(--bg-card)] text-[var(--text)]
              border border-[var(--border)] rounded-lg px-3 py-2.5
              placeholder:text-[var(--text-muted)] focus:outline-none
              focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent
              transition-colors hover:border-[var(--text-muted)]"
            aria-label={t.filterMaxPrice}
          />
        </div>

        {/* Fuel Type */}
        <div className="relative">
          <label className="sr-only">{t.filterFuelType}</label>
          <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}
            className={selectCls} aria-label={t.filterFuelType}>
            <option value="">{t.filterFuelType}</option>
            {fuelTypes.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          <ChevronDown />
        </div>

        {/* Reset — only visible when filters are active (Occam's Razor) */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 text-sm font-semibold
              text-[var(--accent)] border border-[var(--accent)] rounded-lg px-3 py-2.5
              hover:bg-[var(--accent)] hover:text-white transition-colors"
            aria-label={t.resetFilters}
          >
            <ResetIcon />
            {t.resetFilters}
          </button>
        )}
      </div>
    </section>
  );
}

const ChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none
      text-[var(--text-muted)]" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
  </svg>
);
