"use client";
// src/app/components/Footer.jsx
import React from "react";
import Link from "next/link";

const SOCIALS = [
    { name: "Facebook", href: "#", src: "https://iqcars-assets.iqcars.io/images/platforms/facebook.svg" },
    { name: "Instagram", href: "#", src: "https://iqcars-assets.iqcars.io/images/platforms/instagram.svg" },
    { name: "TikTok", href: "#", src: "https://iqcars-assets.iqcars.io/images/platforms/tiktok.svg" },
    { name: "X", href: "#", src: "https://iqcars-assets.iqcars.io/images/platforms/x.svg" },
    { name: "Threads", href: "#", src: "https://iqcars-assets.iqcars.io/images/platforms/threads.svg" },
    { name: "LinkedIn", href: "#", src: "https://iqcars-assets.iqcars.io/images/platforms/linkedin.svg" },
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
                        <img src="/logo_.png" alt="IQCars Logo" className="h-10 w-auto" />
                    </div>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-xs">
                        Iraq's premier car listing platform. Find your perfect vehicle from
                        thousands of listings across the country.
                    </p>
                </div>

                {/* Contact column */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)]">
                        {t.information}
                    </h3>
                    <a href={`tel:${t.phoneNumber.replace(/\s/g, "")}`}
                        className="flex items-center gap-2.5 text-[var(--text-muted)] hover:text-[var(--accent)]
              text-sm transition-colors">
                        <PhoneIcon /> {t.phoneNumber}
                    </a>
                    <div className="flex items-center gap-2.5 text-[var(--text-muted)] text-sm">
                        <PinIcon /> {t.address}
                    </div>
                    <a href={`mailto:${t.email}`}
                        className="flex items-center gap-2.5 text-[var(--text-muted)] hover:text-[var(--accent)]
              text-sm transition-colors">
                        <MailIcon /> {t.email}
                    </a>
                </div>


            </div>

            {/* Bottom bar */}
            <div className="border-t border-[var(--border)]">
                <div className="max-w-6xl mx-auto px-6 md:px-10 py-5 flex flex-col sm:flex-row
          items-center justify-between gap-4">
                    <p className="text-[var(--text-muted)] text-xs">{t.copyright}</p>

                    <div className="flex items-center gap-3">
                        {SOCIALS.map((s) => (
                            <a
                                key={s.name}
                                href={s.href}
                                aria-label={s.name}
                                className="opacity-80 hover:opacity-100 transition-opacity"
                            >
                                <img
                                    src={s.src}
                                    alt={s.name}
                                    width={24}
                                    height={24}
                                    className="dark:invert"
                                    loading="lazy"
                                />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default React.memo(Footer);