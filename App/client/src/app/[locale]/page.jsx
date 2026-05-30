// src/app/[locale]/page.jsx
import { setRequestLocale } from "next-intl/server";
import { fetchCars } from "@/lib/strapiService";
import HomeClient from "./HomeClient";

export async function generateStaticParams() {
    return ["ar", "en", "ckb"].map((locale) => ({ locale }));
}

export default async function LocalePage({ params }) {
    const { locale } = await params;

    setRequestLocale(locale);

    let cars = [];
    let error = null;

    try {
        cars = await fetchCars(locale);
    } catch (e) {
        error = e.message;
    }

    return <HomeClient initialCars={cars} initialError={error} />;
}