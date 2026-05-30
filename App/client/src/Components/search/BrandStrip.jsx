"use client";
// src/app/components/BrandStrip.jsx
// Top row of the FilterBar: city picker on the left, brand logo quick-picks,
// and an "all brands" arrow button that opens AllBrandsPanel.

import React, { useRef, useState } from "react";
import { BRANDS } from "./searchConstants";
import { ChevronRightIcon } from "../layout/Icons";
import CityPicker from "./CityPicker";
import AllBrandsPanel from "./AllBrandsPanel";

const VISIBLE_COUNT = 8;

/**
 * @param {string}   make     — selected brand name (or "")
 * @param {Function} setMake  — setter
 * @param {string}   city     — selected city (or "")
 * @param {Function} setCity  — setter
 */
export default function BrandStrip({ make, setMake, city, setCity }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const stripRef = useRef(null);

  const visibleBrands = BRANDS.slice(0, VISIBLE_COUNT);

  return (
    <div ref={stripRef} className="relative px-5 py-4 border-b border-[var(--border)]">
      <div className="flex items-center gap-2">
        {/* City picker pinned to the left */}
        <CityPicker city={city} setCity={setCity} />

        {/* Logo card quick-picks */}
        <div className="flex items-center gap-1.5 flex-1">
          {visibleBrands.map((brand) => (
            <button
              key={brand.name}
              onClick={() => setMake(make === brand.name ? "" : brand.name)}
              title={brand.name}
              className={`shrink-0 w-[72px] h-[52px] rounded-xl border transition-all duration-200
                flex items-center justify-center p-2 cursor-pointer
                hover:border-[var(--accent)] hover:shadow-sm
                ${make === brand.name
                  ? "border-[var(--accent)] bg-white/90 shadow-sm border-2"
                  : "border-[var(--border)] bg-white/90"
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

        {/* "All brands" arrow button */}
        <button
          onClick={() => setPanelOpen((v) => !v)}
          className={`shrink-0 w-[52px] h-[52px] rounded-xl border flex items-center justify-center cursor-pointer
            transition-all duration-200 font-bold text-lg
            ${panelOpen
              ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--bg-subtle)] border-2"
              : "border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            }`}
          aria-label="Show all brands"
          aria-expanded={panelOpen}
        >
          <ChevronRightIcon />
        </button>
      </div>

      {panelOpen && (
        <AllBrandsPanel
          make={make}
          setMake={setMake}
          onClose={() => setPanelOpen(false)}
        />
      )}
    </div>
  );
}
