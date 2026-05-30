// proxy.js (project root)
import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export function proxy(req) {
  return intlMiddleware(req);
}

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