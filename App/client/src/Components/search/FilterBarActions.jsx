"use client";
// src/app/components/FilterBarActions.jsx
// Reset link + "Show N Cars" button at the right end of the FilterBar.

import React from "react";
import { SearchIcon } from "../layout/Icons";

/**
 * @param {boolean}  hasFilters  — whether any filter is active (shows Reset)
 * @param {Function} onReset     — clears all filters
 * @param {number}   totalCount  — number of matching cars
 */
export default function FilterBarActions({ hasFilters, onReset, totalCount }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 shrink-0">
      {hasFilters && onReset && (
        <button
          onClick={onReset}
          className="text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer
            transition-colors underline underline-offset-2 whitespace-nowrap"
          aria-label="Reset filters"
        >
          Reset
        </button>
      )}
      <button
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm
          text-white cursor-pointer hover:opacity-90 active:scale-[.98] transition-all whitespace-nowrap"
        style={{ background: "var(--accent)" }}
        aria-label="Show cars"
      >
        <SearchIcon />
        Show{totalCount > 0 ? ` ${totalCount.toLocaleString()}` : ""} Cars
      </button>
    </div>
  );
}
