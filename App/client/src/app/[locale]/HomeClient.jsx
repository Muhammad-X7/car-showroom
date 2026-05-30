"use client";
// src/app/[locale]/HomeClient.jsx

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Header from "@/Components/layout/Header";
import Footer from "@/Components/layout/Footer";
import CarCard from "@/Components/cars/CarCard";
import MobileSearchBar from "@/Components/search/MobileSearchBar";
import FilterBar from "@/Components/search/FilterBar";
import SearchModal from "@/Components/search/SearchModal";

const PAGE_SIZE = 12;

function unique(arr) {
    return [...new Set(arr.filter(Boolean))].sort();
}

export default function HomeClient({ initialCars = [], initialError = null }) {
    const t = useTranslations();        // ← reads from next-intl context
    const locale = useLocale();         // ← "ar" | "en" | "ckb" from URL
    const router = useRouter();
    const pathname = usePathname();

    const isRtl = locale === "ar" || locale === "ckb";

    // Language switcher: navigates to /[newLocale]/... instead of setting state
    const setLang = useCallback((newLocale) => {
        // Replace the locale segment in the current path
        // e.g. /ar/cars/5 → /en/cars/5
        const segments = pathname.split("/");
        segments[1] = newLocale;
        router.push(segments.join("/"));
    }, [pathname, router]);

    const cars = initialCars;
    const error = initialError;

    const [searchTerm, setSearchTerm] = useState("");
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [city, setCity] = useState("");
    const [mileage, setMileage] = useState("");
    const [price, setPrice] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minMileage, setMinMileage] = useState("");
    const [maxMileage, setMaxMileage] = useState("");
    const [transmission, setTransmission] = useState("");
    const [fuelType, setFuelType] = useState("");
    const [page, setPage] = useState(1);
    const [searchModalOpen, setSearchModalOpen] = useState(false);

    const onReset = useCallback(() => {
        setSearchTerm(""); setMake(""); setModel(""); setYear(""); setCity("");
        setMileage(""); setPrice("");
        setMinPrice(""); setMaxPrice(""); setMinMileage(""); setMaxMileage("");
        setTransmission(""); setFuelType("");
        setPage(1);
    }, []);

    const makes = useMemo(() => unique(cars.map((c) => c.make)), [cars]);
    const models = useMemo(
        () => unique(cars.filter((c) => !make || c.make === make).map((c) => c.model)),
        [cars, make]
    );
    const years = useMemo(() => unique(cars.map((c) => c.year)), [cars]);
    const transmissions = useMemo(() => unique(cars.map((c) => c.transmission)), [cars]);
    const fuelTypes = useMemo(() => unique(cars.map((c) => c.fuelType)), [cars]);

    const filtered = useMemo(() => {
        const q = searchTerm.toLowerCase().trim();
        return cars.filter((c) => {
            if (q && !`${c.make} ${c.model}`.toLowerCase().includes(q)) return false;
            if (make && c.make !== make) return false;
            if (model && c.model !== model) return false;
            if (year && c.year !== year) return false;
            if (minPrice && c.price < Number(minPrice)) return false;
            if (maxPrice && c.price > Number(maxPrice)) return false;
            if (transmission && c.transmission !== transmission) return false;
            if (fuelType && c.fuelType !== fuelType) return false;
            return true;
        });
    }, [cars, searchTerm, make, model, year, minPrice, maxPrice, transmission, fuelType]);

    const visible = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page]);
    const hasMore = visible.length < filtered.length;

    useEffect(() => setPage(1), [
        searchTerm, make, model, year, city, mileage, price,
        minPrice, maxPrice, transmission, fuelType
    ]);

    return (
        <div
            dir={isRtl ? "rtl" : "ltr"}
            className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-300"
        >
            <div className="max-w-6xl mx-auto w-full min-h-screen flex flex-col bg-[var(--bg)] border-x border-[var(--border)]">
                <Header
                    lang={locale}
                    setLang={setLang}      // ← now navigates instead of setting state
                    t={t}
                    onSearchOpen={() => setSearchModalOpen(true)}
                />

                <MobileSearchBar
                    onSearchOpen={() => setSearchModalOpen(true)}
                    totalCount={filtered.length}
                />

                <SearchModal
                    open={searchModalOpen} onClose={() => setSearchModalOpen(false)}
                    make={make} setMake={setMake}
                    model={model} setModel={setModel}
                    year={year} setYear={setYear}
                    city={city} setCity={setCity}
                    minPrice={minPrice} setMinPrice={setMinPrice}
                    maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                    minMileage={minMileage} setMinMileage={setMinMileage}
                    maxMileage={maxMileage} setMaxMileage={setMaxMileage}
                    transmission={transmission} setTransmission={setTransmission}
                    fuelType={fuelType} setFuelType={setFuelType}
                    models={models} years={years}
                    transmissions={transmissions} fuelTypes={fuelTypes}
                    totalCount={filtered.length} t={t}
                />

                <main className="px-6 md:px-10 py-8 flex-1 flex flex-col">
                    <FilterBar
                        t={t}
                        make={make} setMake={setMake}
                        model={model} setModel={setModel}
                        year={year} setYear={setYear}
                        city={city} setCity={setCity}
                        mileage={mileage} setMileage={setMileage}
                        price={price} setPrice={setPrice}
                        models={models} years={years}
                        onReset={onReset} totalCount={filtered.length}
                    />

                    {error && (
                        <div className="flex flex-1 items-center justify-center">
                            <p className="text-sm text-red-500">Could not load cars: {error}</p>
                        </div>
                    )}

                    {!error && filtered.length === 0 && (
                        <div className="flex flex-1 items-center justify-center text-[var(--text-muted)] text-sm">
                            {t("noResults")}
                        </div>
                    )}

                    {!error && visible.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {visible.map((car, i) => (
                                    <CarCard key={car.id} car={car} lang={locale} index={i} t={t} />
                                ))}
                            </div>
                            {hasMore && (
                                <div className="flex justify-center mt-8">
                                    <button
                                        onClick={() => setPage((p) => p + 1)}
                                        className="px-8 py-3 rounded-xl font-bold text-sm text-white hover:opacity-90 active:scale-[.98] cursor-pointer transition-all"
                                        style={{ background: "var(--accent)" }}
                                    >
                                        {t("loadMore")}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>

                <Footer t={t} />
            </div>
        </div>
    );
}