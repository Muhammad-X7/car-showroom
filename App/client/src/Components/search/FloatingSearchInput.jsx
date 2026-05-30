"use client";
// src/app/components/FloatingSearchInput.jsx
// Animated floating-label text input with a search icon.
// Used by AllBrandsPanel and DesktopModelDropdown.

import React, { useState } from "react";
import { SearchIcon } from "../layout/Icons";

/**
 * @param {string}   value      — controlled input value
 * @param {Function} onChange   — called with new string value
 * @param {object}   inputRef   — ref forwarded to the <input>
 * @param {string}   label      — floating label text (e.g. "Search brand")
 */
export default function FloatingSearchInput({ value, onChange, inputRef, label = "Search brand" }) {
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
