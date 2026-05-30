"use client";
// src/app/components/DesktopModelDropdown.jsx
// FilterBar dropdown for car model, with a floating-label search input inside.

import React, { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "../layout/Icons";
import FloatingSearchInput from "./FloatingSearchInput";

/**
 * @param {string}   value    — selected model (or "")
 * @param {Function} onChange — setter
 * @param {string[]} options  — list of model strings
 */
export default function DesktopModelDropdown({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef(null);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open) {
      setSearch("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-4 py-3 flex flex-col gap-0.5 cursor-pointer"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Model
        </span>
        <span className={`text-sm font-medium flex items-center justify-between gap-2
          ${value ? "text-[var(--text)]" : "text-[var(--text-muted)]"}`}>
          <span className="truncate">{value || "Select"}</span>
          <ChevronDownIcon open={open} />
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute top-full left-0 mt-1 z-50
            bg-[var(--bg-card)] border border-[var(--border)] rounded-xl
            shadow-[0_8px_32px_rgba(0,0,0,0.18)] overflow-hidden"
          style={{ minWidth: "220px", width: "100%", display: "flex", flexDirection: "column" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Floating-label search */}
          <div className="px-3 pt-3 pb-2 shrink-0">
            <FloatingSearchInput
              value={search}
              onChange={setSearch}
              inputRef={inputRef}
              label="Search model"
            />
          </div>

          {/* List */}
          <div className="overflow-y-auto" style={{ maxHeight: "220px" }}>
            {filtered.length === 0 && (
              <p className="px-4 py-3 text-sm text-[var(--text-muted)]">No models found</p>
            )}
            {filtered.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm cursor-pointer transition-colors
                  ${value === opt
                    ? "text-[var(--accent)] bg-[var(--bg-subtle)] font-semibold"
                    : "text-[var(--text)] hover:bg-[var(--bg-subtle)]"
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}