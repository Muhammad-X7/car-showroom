// src/app/[locale]/cars/[id]/page.jsx  ← SERVER COMPONENT
import { setRequestLocale } from "next-intl/server";
import { fetchCarById } from "@/lib/strapiService";
import { notFound } from "next/navigation";
import CarDetailClient from "./CarDetailClient";

export default async function CarDetailPage({ params }) {
    const { locale, id } = await params;

    // Tell next-intl which locale this request is for
    setRequestLocale(locale);

    const car = await fetchCarById(id, locale);
    if (!car) notFound();

    return <CarDetailClient car={car} />;
}