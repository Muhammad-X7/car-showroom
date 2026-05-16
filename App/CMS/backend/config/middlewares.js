// backend/config/middlewares.js
// CORS is configured here so the Next.js frontend can call Strapi's API.
// Update FRONTEND_URL in your backend .env to match your actual frontend origin.

module.exports = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            '*.cloudflarestorage.com',
            '*.r2.dev',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            '*.cloudflarestorage.com',
            '*.r2.dev',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      // Allow requests from your Next.js dev server and production domain.
      // Set FRONTEND_URL=https://iqcars.io in your backend .env for production.
      origin: [
        'https://car-showroom-jade.vercel.app',
        process.env.FRONTEND_URL || 'https://car-showroom-jade.vercel.app',
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];