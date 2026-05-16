import createMiddleware from "next-intl/middleware";
import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale } from "./i18n";

const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: false,
});

export default createMiddleware(routing);

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};