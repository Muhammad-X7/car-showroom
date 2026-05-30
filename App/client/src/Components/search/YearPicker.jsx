"use client";
// src/app/components/YearPicker.jsx
// Single From/To year picker used inside DesktopYearDropdown.

import React, { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "../layout/Icons";

export default function YearPicker({ label, value, onChange, yearList, onDone }) {
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

  useEffect(() => {
    if (open && selectedRef.current) {
      setTimeout(() => {
        selectedRef.current?.scrollIntoView({ block: "nearest" });
      }, 30);
    }
  }, [open]);

  const isLifted = open || !!value;

  return (
    <div ref={ref} className="relative flex-1 min-w-0">

      {/* Outer wrapper holds the border and the floating label together */}
      <div
        onClick={() => setOpen((v) => !v)}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          position: "relative",
          border: `1.5px solid ${open ? "var(--accent)" : "var(--border)"}`,
          borderRadius: "0.15rem",
          padding: "10px 12px",
          cursor: "pointer",
          background: "var(--bg-card)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          transition: "border-color 0.15s ease",
        }}
        className="hover:border-[var(--accent)]"
      >
        {/* Floating label — background punches through the border line */}
        <span
          style={{
            position: "absolute",
            left: "10px",
            top: "-9px",                          /* sits exactly on the border */
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: open ? "var(--accent)" : "var(--text-muted)",
            background: "var(--bg-card)",         /* cuts out the border behind the text */
            padding: "0 4px",
            lineHeight: 1,
            pointerEvents: "none",
            transition: "color 0.18s ease",
            zIndex: 1,
            /* Only show lifted label when lifted; hide by moving off-screen otherwise */
            opacity: isLifted ? 1 : 0,
          }}
        >
          {label}
        </span>

        {/* Inline placeholder label when not lifted (sits inside the box) */}
        {!isLifted && (
          <span
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--text-muted)",
              pointerEvents: "none",
              flex: 1,
            }}
          >
            {label}
          </span>
        )}

        {/* Selected year value */}
        {isLifted && (
          <span
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: value ? "var(--text)" : "var(--text-muted)",
              flex: 1,
            }}
          >
            {value || ""}
          </span>
        )}

        <ChevronDownIcon open={open} />
      </div>

      {/* Scrollable year list */}
      {open && (
        <div
          className="absolute top-full left-0 mt-1 z-[60]
            bg-[var(--bg-card)] border border-[var(--border)] rounded-sm
            shadow-[0_8px_32px_rgba(0,0,0,0.18)] overflow-y-auto py-1"
          style={{ width: "100%", minWidth: "130px", maxHeight: "220px" }}
        >
          <button
            onClick={() => { onChange(""); setOpen(false); }}
            className={`w-full text-left px-4 py-2.5 text-sm cursor-pointer transition-colors 
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
              className={`w-full text-left px-4 py-2.5 text-sm cursor-pointer transition-colors
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