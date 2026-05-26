"use client";
// src/app/components/Header.jsx
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const LANGS = [
    { code: "en", label: "EN", flag: "https://flagcdn.com/w40/us.jpg" },
    { code: "ar", label: "AR", flag: "https://flagcdn.com/w40/iq.jpg" },
    { code: "ku", label: "KU", flag: "/Flag_of_Kurdistan.svg" },
];

const GlobeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
        className="w-5 h-5" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        <path d="M2 12h20" />
    </svg>
);

function Header({ lang, setLang, t }) {
    // ↑ NOTE: onSearchOpen is intentionally removed from props here.
    // The Search button has been moved to MobileSearchBar.jsx (below the header).

    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const handleOutside = useCallback((e) => {
        if (!e.target.closest("[data-lang-selector]")) setOpen(false);
    }, []);

    useEffect(() => {
        document.addEventListener("click", handleOutside);
        return () => document.removeEventListener("click", handleOutside);
    }, [handleOutside]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const currentLang = LANGS.find((l) => l.code === lang) || LANGS[0];

    return (
        <header
            className={`sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-4
        bg-[var(--bg-card)] border-b border-[var(--border)] transition-shadow duration-200
        ${scrolled ? "shadow-md" : ""}`}
            style={{ fontFamily: "var(--font-display)" }}
        >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group" aria-label="IQCars home">
                <img src="/logo_.png" alt="IQCars Logo" className="h-10 w-auto" />
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">

                {/* Language Selector */}
                <div className="relative" data-lang-selector>
                    <button
                        onClick={() => setOpen((v) => !v)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold
              text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-subtle)]
              transition-colors border border-[var(--border)]"
                        aria-label="Change language"
                        aria-haspopup="listbox"
                        aria-expanded={open}
                    >
                        <GlobeIcon />
                        <img src={currentLang.flag} alt={currentLang.code}
                            className="w-5 h-3.5 object-cover rounded-[2px]" />
                        <span>{currentLang.label}</span>
                    </button>

                    {open && (
                        <div
                            className="dropdown-menu absolute top-full mt-2 right-0 w-36
                bg-[var(--bg-card)] border border-[var(--border)] rounded-xl
                shadow-[var(--shadow-lg)] overflow-hidden py-1"
                            role="listbox"
                            aria-label="Select language"
                        >
                            {LANGS.map((l) => (
                                <button
                                    key={l.code}
                                    role="option"
                                    aria-selected={lang === l.code}
                                    onClick={() => { setLang(l.code); setOpen(false); }}
                                    className={`lang-item w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold
                    ${lang === l.code
                                            ? "text-[var(--accent)] bg-[var(--bg-subtle)] active"
                                            : "text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text)]"
                                        }`}
                                >
                                    <img src={l.flag} alt={l.code}
                                        className="w-6 h-4 object-cover rounded-[2px] shrink-0" />
                                    {l.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ✅ Search button REMOVED from here — now lives in MobileSearchBar.jsx */}
            </div>
        </header>
    );
}

export default React.memo(Header);