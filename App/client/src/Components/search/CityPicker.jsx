"use client";
// src/app/components/CityPicker.jsx
// City dropdown used in the FilterBar brand strip row.

import React, { useRef, useState } from "react";
import { IRAQ_CITIES } from "./searchConstants";
import { PinIcon, ChevronDownIcon } from "../layout/Icons";

export default function CityPicker({ city, setCity }) {
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
          text-[var(--text)] hover:text-[var(--accent)] cursor-pointer transition-colors
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
          shadow-[0_8px_32px_rgba(0,0,0,0.18)] py-1 max-h-52 overflow-y-auto">
          {IRAQ_CITIES.map((c) => (
            <button
              key={c}
              onClick={() => { setCity(c); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm cursor-pointer transition-colors
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