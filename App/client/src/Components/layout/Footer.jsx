"use client";
// src/app/components/Footer.jsx
import React from "react";
import Link from "next/link";

const SOCIALS = [
    {
        name: "Facebook",
        href: "#",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
        ),
    },
    {
        name: "Instagram",
        href: "#",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
        ),
    },
    {
        name: "TikTok",
        href: "#",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
            </svg>
        ),
    },
    {
        name: "X",
        href: "#",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.733-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
    },
];

const PinIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
        className="w-4 h-4 shrink-0" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);

const MailIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
        className="w-4 h-4 shrink-0" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
);

const PhoneIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
        className="w-4 h-4 shrink-0" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.08 6.08l.91-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

function Footer({ t }) {
    return (
        <footer
            className="mt-auto border-t border-[var(--border)] bg-[var(--bg-card)]"
            style={{ fontFamily: "var(--font-body)" }}
        >
            <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

                {/* Brand column */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="IQCars Logo" className="h-10 w-auto" />
                    </div>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-xs">
                        {/* Iraq's premier car listing platform. Find your perfect vehicle from
                        thousands of listings across the country. */}
                        {t("Description")}
                    </p>
                </div>

                {/* Contact column */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)]">
                        {t("information")}
                    </h3>
                    <a href={`tel:${t("phoneNumber").replace(/\s/g, "")}`}
                        className="flex items-center gap-2.5 text-[var(--text-muted)] hover:text-[var(--accent)]
              text-sm transition-colors">
                        <PhoneIcon /> {t("phoneNumber")}
                    </a>
                    <div className="flex items-center gap-2.5 text-[var(--text-muted)] text-sm">
                        <PinIcon /> {t("address")}
                    </div>
                    <a href={`mailto:${t("email")}`}
                        className="flex items-center gap-2.5 text-[var(--text-muted)] hover:text-[var(--accent)]
              text-sm transition-colors">
                        <MailIcon /> {t("email")}
                    </a>
                </div>


            </div>

            {/* Bottom bar */}
            <div className="border-t border-[var(--border)]">
                <div className="max-w-6xl mx-auto px-6 md:px-10 py-5 flex flex-col sm:flex-row
          items-center justify-between gap-4">
                    <p className="text-[var(--text-muted)] text-xs">Copyright © 2026 Cars</p>

                    <div className="flex items-center gap-3">
                        {SOCIALS.map((s) => (
                            <a
                                key={s.name}
                                href={s.href}
                                aria-label={s.name}
                                className="opacity-80 hover:opacity-100 transition-opacity"
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default React.memo(Footer);