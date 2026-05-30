// src/app/components/CarCard.jsx
import React from "react";
import Image from "next/image";
import Link from "next/link";

/* ── Badge labels (Von Restorff: isolated, high-contrast) ─────────── */
const TypeBadge = ({ type, t }) => {
    if (type === "freePlate") return (
        <span className="absolute top-3 left-3 bg-[var(--pink)] text-white
      text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
            {t("freePlate")}
        </span>
    );
    if (type === "privateSeller") return (
        <span className="absolute top-3 left-3 bg-[var(--green)] text-white
      text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
            {t("privateSeller")}
        </span>
    );
    return null;
};

const PinIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);

function getLocalizedMake(car, lang) {
    if (lang === "ar" && car.makeAr) return car.makeAr;
    if (lang === "ckb" && car.makeKu) return car.makeKu;
    return car.make;
}

export default function CarCard({ car, lang, index = 0, t }) {
    const make = getLocalizedMake(car, lang);
    // Staggered entrance: index % 8 keeps delays short even for large grids
    const delay = `${(index % 8) * 0.07}s`;

    return (
        <Link
            href={`/${lang}/cars/${car.id}`}
            className="animate-card block bg-[var(--bg-card)] border border-[var(--border)]
        rounded-xl overflow-hidden shadow-[var(--shadow-sm)]
        hover:shadow-[var(--shadow-md)] hover:-translate-y-1
        transition-[shadow,transform] duration-200 focus-visible:ring-2
        focus-visible:ring-[var(--accent)] group"
            style={{ animationDelay: delay }}
            aria-label={`${make} ${car.model} — ${car.priceFormatted} ${car.priceCurrency}`}
        >
            {/* Image — aspect-ratio set to prevent CLS (Mobile Guide §4) */}
            <div className="img-wrap" style={{ aspectRatio: "4/3" }}>
                <Image
                    src={car.image}
                    alt={`${make} ${car.model}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    loading={index < 4 ? "eager" : "lazy"}   /* above-fold: eager */
                />
                <TypeBadge type={car.type} t={t} />
            </div>

            {/* Content — Law of Common Region: one shared container */}
            <div className="p-4 flex flex-col gap-3">
                {/* Title + Price — Law of Proximity: related items closest */}
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[15px] font-bold text-[var(--text)] leading-snug tracking-tight"
                        style={{ fontFamily: "var(--font-display)" }}>
                        {make} {car.model}
                    </h3>

                    {/* Price: Von Restorff — accent color, high contrast */}
                    <div className="text-right shrink-0">
                        <span className="block text-lg font-extrabold leading-none"
                            style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}>
                            {car.priceCurrency === "IQD"
                                ? car.priceFormatted
                                : `$${car.priceFormatted}`}
                        </span>
                        {car.priceCurrency === "IQD" && (
                            <span className="text-[10px] text-[var(--text-muted)] font-medium">IQD</span>
                        )}
                    </div>
                </div>

                {/* Spec Tags — Law of Similarity: identical chip shape/color = related group */}
                <div className="flex flex-wrap gap-1.5">
                    {[car.year, car.odometer, car.transmission].filter(Boolean).map((tag, i) => (
                        <span key={i}
                            className="text-[10px] font-semibold uppercase tracking-wide
                px-2.5 py-1 rounded-md bg-[var(--bg-subtle)] text-[var(--text-muted)]">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Location footer — separated by border, Law of Proximity: far from price */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-[var(--border)]
          text-[var(--text-muted)] text-xs font-medium">
                    <PinIcon />
                    {car.location}
                </div>
            </div>
        </Link>
    );
}