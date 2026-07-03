/// <reference lib="esnext" />
/// <reference lib="webworker" />
import type { PrecacheEntry, RuntimeCaching, SerwistGlobalConfig } from "serwist";
import {
  CacheableResponsePlugin,
  CacheFirst,
  ExpirationPlugin,
  NetworkFirst,
  RangeRequestsPlugin,
  Serwist,
  StaleWhileRevalidate,
} from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// Ported from the previous next-pwa `customRuntimeCaching.js`.
// The cache names below (especially `cross-origin` and `rsc`) are relied upon
// by the client-side preload/offline logic in
// `src/utils/prefetch-allcards.ts` and `src/components/Preload/PreloadComponent.tsx`,
// so they must be kept in sync.
const runtimeCaching: RuntimeCaching[] = [
  {
    matcher: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
    handler: new CacheFirst({
      cacheName: "google-fonts-webfonts",
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
        }),
      ],
    }),
  },
  {
    matcher: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
    handler: new StaleWhileRevalidate({
      cacheName: "google-fonts-stylesheets",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 4,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        }),
      ],
    }),
  },
  {
    matcher: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
    handler: new StaleWhileRevalidate({
      cacheName: "static-font-assets",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 4,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        }),
      ],
    }),
  },
  {
    matcher: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
    handler: new StaleWhileRevalidate({
      cacheName: "static-image-assets",
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        }),
      ],
    }),
  },
  {
    matcher: /\/_next\/image\?url=.+$/i,
    handler: new StaleWhileRevalidate({
      cacheName: "next-image",
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({
          maxEntries: 10000,
          maxAgeSeconds: 24 * 60 * 60 * 30 * 12, // 1 year
        }),
      ],
    }),
  },
  {
    matcher: /\.(?:mp3|wav|ogg)$/i,
    handler: new CacheFirst({
      cacheName: "static-audio-assets",
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new RangeRequestsPlugin(),
        new ExpirationPlugin({
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        }),
      ],
    }),
  },
  {
    matcher: /\.(?:mp4)$/i,
    handler: new CacheFirst({
      cacheName: "static-video-assets",
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new RangeRequestsPlugin(),
        new ExpirationPlugin({
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        }),
      ],
    }),
  },
  {
    matcher: /\.(?:js)$/i,
    handler: new StaleWhileRevalidate({
      cacheName: "static-js-assets",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        }),
      ],
    }),
  },
  {
    matcher: /\.(?:css|less)$/i,
    handler: new StaleWhileRevalidate({
      cacheName: "static-style-assets",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        }),
      ],
    }),
  },
  {
    // Next.js 16 generates `_rsc` as a base64url-encoded 96-bit SHA-256 digest
    // (16 chars from [A-Za-z0-9-_]), not the old 5-char value. Match the param
    // regardless of its value/length so RSC prefetches land in this cache.
    matcher: /[?&]_rsc\b/i,
    handler: new StaleWhileRevalidate({
      cacheName: "rsc",
      plugins: [
        {
          // Strip the `?_rsc=...` query so navigations to the same route
          // resolve to a single cache entry (used by the set/search preload).
          cacheKeyWillBeUsed: async ({ request }) => {
            return request.url.replace(/[?&]_rsc=[^&]*/i, "");
          },
        },
        new ExpirationPlugin({
          maxEntries: 1000,
          maxAgeSeconds: 24 * 60 * 60 * 30, // 30 days
        }),
      ],
    }),
  },
  {
    matcher: /\.(?:json|xml|csv)$/i,
    handler: new NetworkFirst({
      cacheName: "static-data-assets",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        }),
      ],
    }),
  },
  {
    matcher: ({ url, sameOrigin }) => {
      if (!sameOrigin) return false;
      const pathname = url.pathname;
      // Exclude /api/auth/callback/* to fix OAuth workflow in Safari.
      if (pathname.startsWith("/api/auth/")) return false;
      if (pathname.startsWith("/api/")) return true;
      return false;
    },
    method: "GET",
    handler: new NetworkFirst({
      cacheName: "apis",
      networkTimeoutSeconds: 10, // fall back to cache if the api does not respond within 10s
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({
          maxEntries: 16,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        }),
      ],
    }),
  },
  {
    matcher: ({ url, sameOrigin }) => {
      if (!sameOrigin) return false;
      if (url.pathname.startsWith("/api/")) return false;
      return true;
    },
    handler: new NetworkFirst({
      cacheName: "others",
      networkTimeoutSeconds: 10,
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({
          maxEntries: 2000,
          maxAgeSeconds: 24 * 60 * 60 * 30, // 1 month
        }),
      ],
    }),
  },
  {
    matcher: ({ sameOrigin }) => !sameOrigin,
    handler: new StaleWhileRevalidate({
      cacheName: "cross-origin",
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({
          maxEntries: 10000,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 1 month
        }),
      ],
    }),
  },
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching,
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
      {
        url: "/images/Cardback.webp",
        matcher({ request }) {
          return request.destination === "image";
        },
      },
    ],
  },
});

serwist.addEventListeners();
