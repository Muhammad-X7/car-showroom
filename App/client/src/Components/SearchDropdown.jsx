"use client";
// src/app/components/SearchDropdown.jsx
// Shared dropdown used by FilterBar (desktop) and SearchModal (mobile).
// Each consumer passes its own className for layout differences.

import React, { useRef, useState, useEffect } from "react";
import { ChevronDownIcon } from "./Icons";

/**
 * @param {string}   label        — small label shown above the current value (desktop style)
 * @param {string}   value        — currently selected value
 * @param {Function} onChange     — called with the new value (or "" for clear)
 * @param {string[]} options      — list of option strings
 * @param {string}   placeholder  — text shown when nothing is selected
 * @param {string}   variant      — "desktop" | "mobile"  (controls visual layout)
 */
export default function SearchDropdown({
    label,
    value,
    onChange,
    options,
    placeholder,
    variant = "desktop",
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClick(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    /* ── Desktop trigger: stacked label + value ── */
    const desktopTrigger = (
        <button
            onClick={() => setOpen((v) => !v)}
            className="w-full text-left px-4 py-3 flex flex-col gap-0.5"
            aria-haspopup="listbox"
            aria-expanded={open}
        >
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {label}
            </span>
            <span className={`text-sm font-medium flex items-center justify-between gap-2
        ${value ? "text-[var(--text)]" : "text-[var(--text-muted)]"}`}>
                <span className="truncate">{value || placeholder}</span>
                <ChevronDownIcon open={open} />
            </span>
        </button>
    );

    /* ── Mobile trigger: single-line pill ── */
    const mobileTrigger = (
        <button
            onClick={() => setOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl
        border border-[var(--border)] bg-[var(--bg-subtle)]
        text-sm font-medium text-[var(--text)] transition-colors
        hover:border-[var(--accent)]"
            aria-haspopup="listbox"
            aria-expanded={open}
        >
            <span className={value ? "text-[var(--text)]" : "text-[var(--text-muted)]"}>
                {value || label}
            </span>
            <ChevronDownIcon open={open} />
        </button>
    );

    return (
        <div ref={ref} className="relative flex-1 min-w-0">
            {variant === "desktop" ? desktopTrigger : mobileTrigger}

            {open && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50
          bg-[var(--bg-card)] border border-[var(--border)] rounded-xl
          shadow-[0_8px_32px_rgba(0,0,0,0.18)] overflow-hidden py-1
          min-w-[180px] max-h-52 overflow-y-auto">
                    <button
                        onClick={() => { onChange(""); setOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-[var(--text-muted)]
              hover:bg-[var(--bg-subtle)] transition-colors"
                    >
                        {placeholder || label}
                    </button>
                    {options.map((opt) => (
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
            )}
        </div>
    );
}