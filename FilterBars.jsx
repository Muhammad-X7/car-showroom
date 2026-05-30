"use client";
// src/app/components/FilterBar.jsx
// Desktop-only filter bar (hidden on mobile — SearchModal handles mobile).

import React, { useRef, useState, useEffect } from "react";
import { BRANDS, IRAQ_CITIES, MILEAGE_OPTIONS, PRICE_OPTIONS } from "./App/client/src/Components/searchConstants";
import { PinIcon, SearchIcon, ChevronDownIcon, ChevronRightIcon } from "./App/client/src/Components/Icons";
import SearchDropdown from "./App/client/src/Components/SearchDropdown";

/* ── City picker ─────────────────────────────────────────────────── */
function CityPicker({ city, setCity }) {
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
          text-[var(--text)] hover:text-[var(--accent)] transition-colors
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
          <button
            onClick={() => { setCity(""); setOpen(false); }}
            className="w-full text-left px-4 py-2.5 text-sm text-[var(--text-muted)]
              hover:bg-[var(--bg-subtle)] transition-colors"
          >
            All Iraq
          </button>
          {IRAQ_CITIES.map((c) => (
            <button
              key={c}
              onClick={() => { setCity(c); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors
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

/* ── Floating-label search input (shared) ────────────────────────── */
function FloatingSearchInput({ value, onChange, inputRef, label = "Search brand" }) {
  const [focused, setFocused] = useState(false);
  const isLifted = focused || value.length > 0;

  return (
    <div className="relative">
      <div
        className="relative rounded-lg transition-colors"
        style={{
          border: `1.5px solid ${focused ? "var(--accent)" : "var(--border)"}`,
        }}
      >
        {/* Floating label */}
        <label
          style={{
            position: "absolute",
            left: "12px",
            top: isLifted ? "-9px" : "50%",
            transform: isLifted ? "translateY(0) scale(0.82)" : "translateY(-50%) scale(1)",
            transformOrigin: "left center",
            fontSize: "13px",
            fontWeight: 500,
            color: focused ? "var(--accent)" : "var(--text-muted)",
            background: "var(--bg-card)",
            padding: "0 4px",
            pointerEvents: "none",
            transition: "top 0.18s ease, transform 0.18s ease, color 0.18s ease",
            zIndex: 1,
            lineHeight: 1,
          }}
        >
          {label}
        </label>

        {/* Input row */}
        <div className="flex items-center px-3 py-3 gap-2">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="flex-1 bg-transparent text-sm text-[var(--text)]"
            style={{ outline: "none", border: "none", boxShadow: "none", WebkitAppearance: "none", appearance: "none" }}
            aria-label={label}
          />
          <SearchIcon className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
        </div>
      </div>
    </div>
  );
}

/* ── Brand All-Brands Panel ──────────────────────────────────────── */
function AllBrandsPanel({ make, setMake, onClose }) {
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
              text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-subtle)]
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
                className={`w-full flex items-center gap-4 px-5 py-4 transition-colors
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

/* ── Brand logo strip ────────────────────────────────────────────── */
function BrandStrip({ make, setMake, city, setCity }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const stripRef = useRef(null);

  const VISIBLE_COUNT = 8;
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
                flex items-center justify-center p-2
                hover:border-[var(--accent)] hover:shadow-sm
                ${make === brand.name
                  ? "border-[var(--accent)] shadow-sm bg-[var(--bg-subtle)] border-2"
                  : "border-[var(--border)] bg-[var(--bg-subtle)]"
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
          className={`shrink-0 w-[52px] h-[52px] rounded-xl border flex items-center justify-center
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

/* ── Desktop Model Dropdown (with floating-label search) ─────────── */
function DesktopModelDropdown({ value, onChange, options }) {
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
        className="w-full text-left px-4 py-3 flex flex-col gap-0.5"
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
          {/* Floating-label search — same animation as AllBrandsPanel */}
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
            <button
              onClick={() => { onChange(""); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-sm text-[var(--text-muted)]
                hover:bg-[var(--bg-subtle)] transition-colors"
            >
              All Models
            </button>
            {filtered.length === 0 && (
              <p className="px-4 py-3 text-sm text-[var(--text-muted)]">No models found</p>
            )}
            {filtered.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors
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

/* ── Year sub-picker: one button that opens its own scrollable list ── */
function YearPicker({ label, value, onChange, yearList, onDone }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selectedRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Scroll selected item into view when list opens
  useEffect(() => {
    if (open && selectedRef.current) {
      setTimeout(() => {
        selectedRef.current?.scrollIntoView({ block: "nearest" });
      }, 30);
    }
  }, [open]);

  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      {/* Button: label on top, selected year below (or just label if nothing selected) */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl
          border transition-all duration-150 text-left
          hover:border-[var(--accent)]
          ${open ? "border-[var(--accent)]" : "border-[var(--border)]"}
          bg-[var(--bg-card)]`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex flex-col leading-tight">
          <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            {label}
          </span>
          {value && (
            <span className="text-sm font-semibold text-[var(--text)] mt-0.5">
              {value}
            </span>
          )}
        </div>
        <ChevronDownIcon open={open} />
      </button>

      {/* Scrollable list */}
      {open && (
        <div
          className="absolute top-full left-0 mt-1 z-[60]
            bg-[var(--bg-card)] border border-[var(--border)] rounded-xl
            shadow-[0_8px_32px_rgba(0,0,0,0.18)] overflow-y-auto py-1"
          style={{ width: "100%", minWidth: "130px", maxHeight: "220px" }}
        >
          {/* "All" / clear option */}
          <button
            onClick={() => { onChange(""); setOpen(false); }}
            className={`w-full text-left px-4 py-2.5 text-sm transition-colors
              ${!value
                ? "text-[var(--accent)] bg-[var(--bg-subtle)] font-semibold"
                : "text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]"
              }`}
          >
            All
          </button>
          {yearList.map((y) => (
            <button
              key={y}
              ref={value === y ? selectedRef : null}
              onClick={() => { onChange(y); setOpen(false); onDone && onDone(y); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                ${value === y
                  ? "text-[var(--accent)] bg-[var(--bg-subtle)] font-semibold"
                  : "text-[var(--text)] hover:bg-[var(--bg-subtle)]"
                }`}
            >
              {y}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Desktop Year Range Dropdown (From Year / To Year) ───────────── */
function DesktopYearDropdown({ value, onChange }) {
  const ref = useRef(null);

  // Generate years from current year down to 1930
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

  // Outer trigger label for the FilterBar row
  const triggerLabel = () => {
    if (!from && !to) return "Select";
    if (from && to) return `${from} – ${to}`;
    if (from) return `From ${from}`;
    return `To ${to}`;
  };

  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      {/* FilterBar row trigger — same style as other dropdowns */}
      <button
        onClick={() => setPanelOpen((v) => !v)}
        className="w-full text-left px-4 py-3 flex flex-col gap-0.5"
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

          {/* Done — right-aligned, dark rounded button matching the image */}
          <div className="flex justify-end">
            <button
              onClick={handleDone}
              className="px-8 py-2.5 rounded-xl text-sm font-semibold text-white
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

/* ── FilterBar ───────────────────────────────────────────────────── */
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

        {/* Model — custom desktop dropdown with search */}
        <DesktopModelDropdown
          value={model}
          onChange={setModel}
          options={models.length > 0 ? models : ["Camry", "Corolla", "Land Cruiser", "Yaris"]}
        />

        {/* Year — custom From/To range picker */}
        <DesktopYearDropdown
          value={year}
          onChange={setYear}
          options={allYearOptions}
        />

        {/* Mileage — unchanged SearchDropdown */}
        <SearchDropdown
          label="Mileage" value={mileage} onChange={setMileage}
          options={MILEAGE_OPTIONS}
          placeholder="Select" variant="desktop"
        />

        {/* Price — unchanged SearchDropdown */}
        <SearchDropdown
          label="Price" value={price} onChange={setPrice}
          options={PRICE_OPTIONS}
          placeholder="Select" variant="desktop"
        />

        <div className="flex items-center gap-3 px-4 py-3 shrink-0">
          {hasFilters && onReset && (
            <button
              onClick={onReset}
              className="text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text)]
                transition-colors underline underline-offset-2 whitespace-nowrap"
              aria-label="Reset filters"
            >
              Reset
            </button>
          )}
          <button
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm
              text-white hover:opacity-90 active:scale-[.98] transition-all whitespace-nowrap"
            style={{ background: "var(--accent)" }}
            aria-label="Show cars"
          >
            <SearchIcon />
            Show{totalCount > 0 ? ` ${totalCount.toLocaleString()}` : ""} Cars
          </button>
        </div>
      </div>
    </section>
  );
}