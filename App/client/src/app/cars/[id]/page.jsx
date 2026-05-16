"use client";
// src/app/cars/[id]/page.jsx

import { useState, useEffect, useCallback, use } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Translations from "../..//Translations";

const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

function buildImageUrl(raw) {
    if (!raw) return "/placeholder-car.jpg";
    return raw.startsWith("http") ? raw : `${STRAPI_BASE}${raw}`;
}

function formatCar(car) {
    const a = car.attributes || car;
    // Strapi v5: Image is flat array [{ url }], v4: Image.data[].attributes.url
    const rawImgs =
        a.Image?.data?.map((i) => i?.attributes?.url) ||   // v4
        a.Image?.map((i) => i?.url) ||                      // v5 ✅
        [];
    return {
        id: car.documentId || car.id,   // Strapi v5 routes use documentId
        make: a.Brand || "Unknown",
        makeAr: a.BrandAr || null,
        makeKu: a.BrandKu || null,
        model: a.Name || "Unknown",
        year: a.Year ? String(a.Year) : null,
        odometer: a.Kilometers ? `${Number(a.Kilometers).toLocaleString()} km` : "0 km",
        price: a.Price || 0,
        priceFormatted: a.Price ? Number(a.Price).toLocaleString() : "—",
        priceCurrency: a.Currency || "$",
        images: rawImgs.length ? rawImgs.map(buildImageUrl) : ["/placeholder-car.jpg"],
        trim: a.Trim || null,
        transmission: a.Transmission || null,
        fuelType: a.FuelType || null,
        location: a.Location || "Iraq",
        type: a.Type || null,
        description: a.Description || null,
        color: a.Color || null,
        engineSize: a.EngineSize || null,
        doors: a.Doors || null,
        condition: a.Condition || null,
        cylinders: a.Cylinders || null,
        importCountry: a.importCountry || a.ImportCountry || null,  // Strapi v5 lowercase
        phone: a.Phone || "0750 999 9999",
    };
}

/* ── Icons ──────────────────────────────────────────────────────── */
const BackArrow = ({ flip }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        className={`w-4 h-4 ${flip ? "rotate-180" : ""}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);
const ChevronLeft = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);
const ChevronRight = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);
const PinIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);
const PhoneIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.08 6.08l.91-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);
const WaIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
);

/* ── Spec bar icons ──────────────────────────────────────────────── */
const TrimIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
        className="w-6 h-6 text-[var(--text-muted)]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
    </svg>
);
const OdometerIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
        className="w-6 h-6 text-[var(--text-muted)]">
        <circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 7v5l3 3" />
    </svg>
);
const EngineIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
        className="w-6 h-6 text-[var(--text-muted)]">
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
);
const CylinderIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
        className="w-6 h-6 text-[var(--text-muted)]">
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M6 9.75v8.25m0 0c0 .966 2.686 1.75 6 1.75s6-.784 6-1.75M6 18V9.75M18 9.75V18m0 0c0 .966-2.686 1.75-6 1.75s-6-.784-6-1.75M6 9.75C6 8.784 8.686 8 12 8s6 .784 6 1.75v0c0 .966-2.686 1.75-6 1.75S6 10.716 6 9.75Z" />
    </svg>
);

/* ── Gallery ─────────────────────────────────────────────────────── */
function Gallery({ images, alt }) {
    const [active, setActive] = useState(0);
    const prev = () => setActive((i) => (i === 0 ? images.length - 1 : i - 1));
    const next = () => setActive((i) => (i === images.length - 1 ? 0 : i + 1));

    return (
        <div className="flex flex-col gap-2">
            <div className="relative img-wrap rounded-xl overflow-hidden bg-[var(--bg-subtle)]"
                style={{ aspectRatio: "16/9" }}>
                <Image src={images[active]} alt={`${alt} ${active + 1}`}
                    fill sizes="(max-width:768px) 100vw, 800px"
                    className="object-cover" priority />

                {images.length > 1 && (
                    <>
                        <button onClick={prev} aria-label="Previous photo"
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                bg-black/40 hover:bg-black/60 flex items-center justify-center
                text-white backdrop-blur-sm transition-colors">
                            <ChevronLeft />
                        </button>
                        <button onClick={next} aria-label="Next photo"
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                bg-black/40 hover:bg-black/60 flex items-center justify-center
                text-white backdrop-blur-sm transition-colors">
                            <ChevronRight />
                        </button>
                    </>
                )}

                <span className="absolute bottom-3 right-3 text-xs font-semibold
          bg-black/50 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {active + 1} / {images.length}
                </span>
            </div>

            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((src, i) => (
                        <button key={i} onClick={() => setActive(i)}
                            className={`shrink-0 rounded-lg overflow-hidden border-2 transition-all
                ${i === active ? "border-[var(--accent)]" : "border-transparent opacity-60 hover:opacity-90"}`}
                            style={{ width: 88, height: 60 }} aria-label={`Photo ${i + 1}`}>
                            <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ── Spec bar item ───────────────────────────────────────────────── */
function SpecBarItem({ icon, label }) {
    if (!label) return null;
    return (
        <div className="flex-1 flex flex-col items-center gap-2 py-4
      border-r border-[var(--border)] last:border-r-0 px-2">
            {icon}
            <span className="text-xs font-medium text-[var(--text-muted)] text-center leading-tight">
                {label}
            </span>
        </div>
    );
}

/* ── Spec table row ──────────────────────────────────────────────── */
function SpecRow({ label, value }) {
    if (!value) return null;
    return (
        <div className="flex items-center justify-between py-3.5
      border-b border-[var(--border)] last:border-0">
            <span className="text-sm text-[var(--text-muted)]">{label}</span>
            <span className="text-sm font-medium text-[var(--text)]">{value}</span>
        </div>
    );
}

/* ── Loading skeleton ────────────────────────────────────────────── */
function Skeleton() {
    return (
        <div className="flex flex-col gap-4 max-w-3xl">
            <div className="skeleton rounded-xl" style={{ aspectRatio: "16/9" }} />
            <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="skeleton rounded-lg" style={{ width: 88, height: 60 }} />
                ))}
            </div>
            <div className="skeleton h-8 rounded-lg w-1/2 mt-2" />
            <div className="skeleton h-5 rounded w-1/3" />
            <div className="skeleton h-20 rounded-xl" />
            <div className="skeleton h-48 rounded-xl" />
        </div>
    );
}

/* ── Page ────────────────────────────────────────────────────────── */
export default function CarDetailPage({ params }) {
    const { id } = use(params);

    const [car, setCar] = useState(null);
    const [loading, setLoad] = useState(true);
    const [missing, setMiss] = useState(false);
    const [lang, setLang] = useState("en");
    const [theme, setTheme] = useState("light");

    const t = Translations[lang];
    const isRtl = lang === "ar" || lang === "ku";

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    useEffect(() => {
        document.documentElement.dir = isRtl ? "rtl" : "ltr";
        document.documentElement.lang = lang;
    }, [isRtl, lang]);

    const toggleTheme = useCallback(
        () => setTheme((p) => (p === "light" ? "dark" : "light")), []
    );

    useEffect(() => {
        if (!id) { setMiss(true); setLoad(false); return; }
        fetch(`${STRAPI_BASE}/api/cars/${id}?populate=*`)
            .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
            .then((j) => (j.data ? setCar(formatCar(j.data)) : setMiss(true)))
            .catch(() => setMiss(true))
            .finally(() => setLoad(false));
    }, [id]);

    useEffect(() => {
        if (!car) return;
        const mk = lang === "ar" && car.makeAr ? car.makeAr
            : lang === "ku" && car.makeKu ? car.makeKu : car.make;
        document.title = `${mk} ${car.model}${car.year ? ` ${car.year}` : ""} | IQCars`;
    }, [car, lang]);

    const localMake = car
        ? lang === "ar" && car.makeAr ? car.makeAr
            : lang === "ku" && car.makeKu ? car.makeKu : car.make
        : "";

    return (
        <div className={theme === "dark" ? "dark" : ""}>
            <div dir={isRtl ? "rtl" : "ltr"}
                className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
                <div className="max-w-6xl mx-auto w-full min-h-screen flex flex-col
          bg-[var(--bg)] border-x border-[var(--border)]">

                    <Header lang={lang} setLang={setLang} theme={theme} toggleTheme={toggleTheme} t={t} />

                    <main className="px-6 md:px-10 py-8 flex-1 flex flex-col gap-6 page-enter">

                        <Link href="/"
                            className="inline-flex items-center gap-2 text-sm font-medium
                text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors w-fit">
                            <BackArrow flip={isRtl} />
                            {t.backToListing}
                        </Link>

                        {loading && <Skeleton />}

                        {missing && !loading && (
                            <div className="flex flex-1 items-center justify-center text-[var(--text-muted)] text-sm">
                                Car not found.
                            </div>
                        )}

                        {car && !loading && (
                            <div className="flex flex-col gap-6 max-w-3xl">

                                {/* Gallery */}
                                <Gallery images={car.images} alt={`${localMake} ${car.model}`} />

                                {/* Title + price */}
                                <div className="flex flex-col gap-1.5">
                                    {car.type === "freePlate" && (
                                        <span className="inline-block w-fit mb-1 bg-[var(--pink)] text-white
                      text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                                            {t.freePlate}
                                        </span>
                                    )}
                                    {car.type === "privateSeller" && (
                                        <span className="inline-block w-fit mb-1 bg-[var(--green)] text-white
                      text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                                            {t.privateSeller}
                                        </span>
                                    )}

                                    <h1 className="text-2xl md:text-3xl font-bold"
                                        style={{ fontFamily: "var(--font-display)" }}>
                                        {localMake} {car.model} {car.year}
                                    </h1>

                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
                                            <PinIcon /> {car.location}
                                        </span>
                                        <span className="ms-auto text-xl font-extrabold"
                                            style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}>
                                            {car.priceCurrency === "IQD"
                                                ? `${car.priceFormatted} IQD`
                                                : `$${car.priceFormatted}`}
                                        </span>
                                    </div>
                                </div>

                                {/* Spec bar */}
                                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden flex">
                                    <SpecBarItem icon={<TrimIcon />}
                                        label={car.trim || car.transmission || "—"} />
                                    <SpecBarItem icon={<OdometerIcon />}
                                        label={car.odometer} />
                                    <SpecBarItem icon={<EngineIcon />}
                                        label={car.engineSize ? `Engine, ${car.engineSize}` : (car.fuelType || "—")} />
                                    <SpecBarItem icon={<CylinderIcon />}
                                        label={car.cylinders ? `${car.cylinders} cylinder`
                                            : car.doors ? `${car.doors} doors` : "—"} />
                                </div>

                                {/* CTA buttons */}
                                <div className="flex gap-3">
                                    <a href={`tel:${car.phone.replace(/\s/g, "")}`}
                                        className="flex-1 flex items-center justify-center gap-2.5 py-3.5
                      rounded-xl font-bold text-sm text-white hover:opacity-90
                      active:scale-[.98] transition-all"
                                        style={{ background: "var(--accent)" }}>
                                        <PhoneIcon /> {t.call}
                                    </a>
                                    <a href={`https://wa.me/${car.phone.replace(/[^0-9]/g, "")}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2.5 py-3.5
                      rounded-xl font-bold text-sm text-white bg-[#25d366]
                      hover:bg-[#1fba57] active:scale-[.98] transition-all">
                                        <WaIcon /> {t.whatsapp}
                                    </a>
                                </div>

                                {/* Full spec table — only fields that exist in Strapi */}
                                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-5 py-1">
                                    <h2 className="text-xs font-bold uppercase tracking-widest
                    text-[var(--text-muted)] py-4 border-b border-[var(--border)]">
                                        {t.specifications}
                                    </h2>
                                    <SpecRow label={t.yearLabel} value={car.year} />
                                    <SpecRow label={t.mileageLabel} value={car.odometer} />
                                    <SpecRow label={t.transmissionLabel} value={car.transmission} />
                                    <SpecRow label={t.fuelLabel} value={car.fuelType} />
                                    <SpecRow label="Trim" value={car.trim} />
                                    <SpecRow label="Condition" value={car.condition} />
                                    <SpecRow label="Color" value={car.color} />
                                    <SpecRow label="Engine Size" value={car.engineSize ? String(car.engineSize) : null} />
                                    <SpecRow label="Cylinders" value={car.cylinders ? String(car.cylinders) : null} />
                                    <SpecRow label="Doors" value={car.doors ? String(car.doors) : null} />
                                    <SpecRow label="Import Country" value={car.importCountry} />
                                </div>

                                {/* Description */}
                                {car.description && (
                                    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-5 py-4">
                                        <h2 className="text-xs font-bold uppercase tracking-widest
                      text-[var(--text-muted)] mb-3">{t.overview}</h2>
                                        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                                            {car.description}
                                        </p>
                                    </div>
                                )}

                            </div>
                        )}
                    </main>

                    <Footer t={t} />
                </div>
            </div>
        </div>
    );
}