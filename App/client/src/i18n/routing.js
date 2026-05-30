// src/i18n/routing.js
import { defineRouting } from "next-intl/routing";

export const locales = ["ar", "en", "ckb"];
export const defaultLocale = "ar";

export const routing = defineRouting({
    locales,
    defaultLocale,
    localePrefix: "always",
    localeDetection: false,
});