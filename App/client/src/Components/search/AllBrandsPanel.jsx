"use client";
// src/app/components/AllBrandsPanel.jsx
// Full-screen centered panel listing all brands with a search input.
// Opened from BrandStrip when the user clicks the "→" button.

import React, { useRef, useState } from "react";
import { BRANDS } from "./searchConstants";
import FloatingSearchInput from "./FloatingSearchInput";

/**
 * @param {string}   make     — currently selected brand name (or "")
 * @param {Function} setMake  — setter
 * @param {Function} onClose  — closes the panel
 */
export default function AllBrandsPanel({ make, setMake, onClose }) {
  const [search, setSearch] = useState("");
  const inputRef = useRef(null);

  React.useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  React.useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const filtered = BRANDS.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — centered on screen */}
      <div
        className="fixed z-50
          bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl
          shadow-[0_16px_48px_rgba(0,0,0,0.32)] overflow-hidden"
        style={{ width: "360px", maxHeight: "520px", display: "flex", flexDirection: "column", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Panel header: title + close */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0">
          <span className="text-lg font-bold text-[var(--text)]">Search</span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full
              text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-subtle)] cursor-pointer
              transition-colors text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Floating label search */}
        <div className="px-5 pb-3 shrink-0">
          <FloatingSearchInput
            value={search}
            onChange={setSearch}
            inputRef={inputRef}
            label="Search brand"
          />
        </div>

        {/* Brand list */}
        <div className="overflow-y-auto flex-1">
          {filtered.length === 0 && (
            <p className="px-5 py-4 text-sm text-[var(--text-muted)]">No brands found</p>
          )}
          {filtered.map((brand, i) => (
            <React.Fragment key={brand.name}>
              <button
                onClick={() => { setMake(make === brand.name ? "" : brand.name); onClose(); }}
                className={`w-full flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors
                  hover:bg-[var(--bg-subtle)]
                  ${make === brand.name ? "bg-[var(--bg-subtle)]" : ""}`}
                aria-label={brand.name}
                aria-pressed={make === brand.name}
              >
                {/* Logo — fixed 60×40 box, white bg */}
                <div className="w-[60px] h-[40px] shrink-0 flex items-center justify-center
                  bg-white rounded-md overflow-hidden">
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
                  <span className="hidden text-[10px] font-bold text-[var(--text)]">{brand.name}</span>
                </div>

                {/* Name */}
                <span className={`text-base font-medium flex-1 text-left
                  ${make === brand.name ? "text-[var(--accent)] font-semibold" : "text-[var(--text)]"}`}>
                  {brand.name}
                </span>

                {/* Active dot */}
                {make === brand.name && (
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)] shrink-0" />
                )}
              </button>

              {/* Row separator */}
              {i < filtered.length - 1 && (
                <div className="mx-5 border-b border-[var(--border)]" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
