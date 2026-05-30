import { getRequestConfig } from "next-intl/server";
import { routing } from "./src/i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
    const locale = await requestLocale;
    
    // Fall back to defaultLocale instead of 404ing
    const resolvedLocale = locale && routing.locales.includes(locale)
        ? locale
        : routing.defaultLocale;

    return {
        locale: resolvedLocale,
        messages: (await import(`./messages/${resolvedLocale}.json`)).default,
    };
});