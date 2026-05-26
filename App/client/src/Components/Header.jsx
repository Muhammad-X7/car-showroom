"use client";
// src/app/components/Header.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
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

const MoonIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
        className="w-4 h-4" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

const SunIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
        className="w-4 h-4" aria-hidden="true">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
);

const PhoneIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
        className="w-4 h-4" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.08 6.08l.91-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
        className="w-4 h-4" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path strokeLinecap="round" d="m21 21-4.35-4.35" />
    </svg>
);

function Header({ lang, setLang, theme, toggleTheme, t, onSearchOpen }) {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const themeButtonRef = useRef(null);

    const handleThemeToggle = useCallback(() => {
        if (!document.startViewTransition) {
            toggleTheme();
            return;
        }
        document.startViewTransition(() => {
            toggleTheme();
        });
    }, [toggleTheme]);

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

                {/* Phone — desktop only */}
                <a
                    href={`tel:${t.phoneNumber.replace(/\s/g, "")}`}
                    className="hidden md:flex items-center gap-2 text-[var(--text-muted)]
            hover:text-[var(--accent)] transition-colors text-sm font-medium"
                    aria-label={`Call ${t.phoneNumber}`}
                >
                    <PhoneIcon />
                    <span>{t.phoneNumber}</span>
                </a>

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

                {/* Search button — mobile only */}
                <button
                    onClick={onSearchOpen}
                    className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold
            text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-subtle)]
            transition-colors border border-[var(--border)]"
                    aria-label="Open search"
                >
                    <SearchIcon />
                    <span>Search</span>
                </button>

                {/* Theme Toggle */}
                <button
                    ref={themeButtonRef}
                    onClick={handleThemeToggle}
                    className="p-2 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)]
            text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)]
            transition-colors"
                    aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                >
                    {theme === "light" ? <MoonIcon /> : <SunIcon />}
                </button>
            </div>
        </header>
    );
}

export default React.memo(Header);