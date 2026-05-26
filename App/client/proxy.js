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

// module.exports = [
//   'strapi::logger',
//   'strapi::errors',
//   {
//     name: 'strapi::cors',
//     config: {
//       origin: [
//         'https://car-showroom-jade.vercel.app',
//         'http://localhost:3000',
//       ],
//       methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//       headers: ['Content-Type', 'Authorization'],
//     },
//   },
//   'strapi::poweredBy',
//   'strapi::query',
//   'strapi::body',
//   'strapi::session',
//   'strapi::favicon',
//   'strapi::public',
// ];