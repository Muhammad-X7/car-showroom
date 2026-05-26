"use client";
// src/app/components/MobileSearchBar.jsx
// Visible ONLY on mobile (hidden on md+).
// Sits between the Header and the car cards — acts as a sticky search trigger.

import React from "react";

const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        className="w-4 h-4 shrink-0" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path strokeLinecap="round" d="m21 21-4.35-4.35" />
    </svg>
);

const SlidersIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        className="w-4 h-4 shrink-0" aria-hidden="true">
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="18" x2="20" y2="18" />
        <circle cx="8" cy="6" r="2" fill="currentColor" stroke="none" />
        <circle cx="16" cy="12" r="2" fill="currentColor" stroke="none" />
        <circle cx="10" cy="18" r="2" fill="currentColor" stroke="none" />
    </svg>
);

/**
 * @param {Function} onSearchOpen  — opens SearchModal
 * @param {number}   totalCount    — total cars count to display (optional)
 * @param {string}   t             — translation function (optional)
 */
export default function MobileSearchBar({ onSearchOpen, totalCount }) {
    return (
        // md:hidden — only visible on mobile, invisible on desktop
        <div className="md:hidden w-full px-4 py-3 bg-[var(--bg-card)] border-b border-[var(--border)]">
            <button
                onClick={onSearchOpen}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
          border border-[var(--border)] bg-[var(--bg-subtle)]
          text-sm text-[var(--text-muted)] transition-all
          hover:border-[var(--accent)] hover:text-[var(--text)]
          active:scale-[.98]"
                aria-label="Open search filters"
            >
                {/* Search icon on the left */}
                <SearchIcon />

                {/* Placeholder text */}
                <span className="flex-1 text-left truncate">
                    {totalCount > 0
                        ? `Search ${totalCount.toLocaleString()} cars…`
                        : "Search cars…"}
                </span>

                {/* Filter icon on the right */}
                <span className="flex items-center gap-1 text-xs font-semibold
          text-[var(--accent)] border border-[var(--accent)]/30
          bg-[var(--accent)]/10 px-2 py-0.5 rounded-lg">
                    <SlidersIcon />
                    Filters
                </span>
            </button>
        </div>
    );
}