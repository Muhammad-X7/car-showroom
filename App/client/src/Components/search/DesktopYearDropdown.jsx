"use client";
// src/app/components/DesktopYearDropdown.jsx
// FilterBar year dropdown with a From / To range picker.
// Uses two YearPicker instances side by side.

import React, { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "../layout/Icons";
import YearPicker from "./YearPicker";

/**
 * @param {string}   value    — current range string e.g. "2015 – 2022", single year, or ""
 * @param {Function} onChange — called with the final range string (or "")
 */
export default function DesktopYearDropdown({ value, onChange }) {
  const ref = useRef(null);

  const currentYear = new Date().getFullYear();
  const yearList = Array.from(
    { length: currentYear - 1930 + 1 },
    (_, i) => String(currentYear - i)
  );

  // Parse existing value ("2015 – 2022" or single year or "")
  const parseValue = (v) => {
    if (!v) return { from: "", to: "" };
    if (v.includes("–")) {
      const [f, t] = v.split("–");
      return { from: f.trim(), to: t.trim() };
    }
    return { from: v, to: "" };
  };

  const [from, setFrom] = useState(() => parseValue(value).from);
  const [to, setTo] = useState(() => parseValue(value).to);
  const [panelOpen, setPanelOpen] = useState(false);

  // Sync on external reset
  useEffect(() => {
    const parsed = parseValue(value);
    setFrom(parsed.from);
    setTo(parsed.to);
  }, [value]);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setPanelOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") setPanelOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const handleDone = () => {
    if (!from && !to) onChange("");
    else if (from && to) onChange(`${from} – ${to}`);
    else onChange(from || to);
    setPanelOpen(false);
  };

  const triggerLabel = () => {
    if (!from && !to) return "Select";
    if (from && to) return `${from} – ${to}`;
    if (from) return `From ${from}`;
    return `To ${to}`;
  };

  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      {/* FilterBar row trigger */}
      <button
        onClick={() => setPanelOpen((v) => !v)}
        className="w-full text-left px-4 py-3 flex flex-col gap-0.5 cursor-pointer"
        aria-haspopup="dialog"
        aria-expanded={panelOpen}
      >
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Year
        </span>
        <span className={`text-sm font-medium flex items-center justify-between gap-2
          ${(from || to) ? "text-[var(--text)]" : "text-[var(--text-muted)]"}`}>
          <span className="truncate">{triggerLabel()}</span>
          <ChevronDownIcon open={panelOpen} />
        </span>
      </button>

      {/* Dropdown panel */}
      {panelOpen && (
        <div
          className="absolute top-full left-0 mt-1 z-50
            bg-[var(--bg-card)] border border-[var(--border)] rounded-xl
            shadow-[0_8px_32px_rgba(0,0,0,0.18)] p-4"
          style={{ minWidth: "300px" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Two side-by-side pickers */}
          <div className="flex gap-3 mb-4">
            <YearPicker
              label="From Year"
              value={from}
              onChange={setFrom}
              yearList={yearList}
            />
            <YearPicker
              label="To Year"
              value={to}
              onChange={setTo}
              yearList={yearList}
            />
          </div>

          {/* Separator */}
          <div className="border-t border-[var(--border)] -mx-4 mb-3" />

          {/* Done button */}
          <div className="flex justify-end">
            <button
              onClick={handleDone}
              className="px-8 py-2.5 rounded-md text-sm font-semibold text-white cursor-pointer
                hover:opacity-90 active:scale-[.98] transition-all"
              style={{ background: "var(--accent)" }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
