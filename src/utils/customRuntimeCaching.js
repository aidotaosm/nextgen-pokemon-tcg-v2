"use strict";

// Workbox RuntimeCaching config: https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.RuntimeCachingEntry

module.exports = [
  {
    urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
    handler: "CacheFirst",
    options: {
      cacheName: "google-fonts-webfonts",
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
      },
    },
  },
  {
    urlPattern: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "google-fonts-stylesheets",
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      },
    },
  },
  {
    urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "static-font-assets",
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      },
    },
  },

  {
    urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "static-image-assets",
      expiration: {
        maxEntries: 64,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },
  {
    urlPattern: /\/_next\/image\?url=.+$/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "next-image",
      expiration: {
        maxEntries: 10000,
        maxAgeSeconds: 24 * 60 * 60 * 30 * 12, // 1 year
      },
    },
  },
  {
    urlPattern: /\.(?:mp3|wav|ogg)$/i,
    handler: "CacheFirst",
    options: {
      rangeRequests: true,
      cacheName: "static-audio-assets",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },
  {
    urlPattern: /\.(?:mp4)$/i,
    handler: "CacheFirst",
    options: {
      rangeRequests: true,
      cacheName: "static-video-assets",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },
  {
    urlPattern: /\.(?:js)$/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "static-js-assets",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },
  {
    urlPattern: /\.(?:css|less)$/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "static-style-assets",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },
  {
    urlPattern: /^.*\?_rsc=\w{5}$/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "rsc",
      plugins: [
        {
          // cacheWillUpdate: async ({ request, response }) => {
          //   console.log(request, "request");
          //   console.log(response, "response");

          //   // if (navigator.onLine) {
          //   let openedCache = await caches.open("rsc");
          //   let cacheKEys = await openedCache.keys();
          //   let isDuplicate = false;
          //   const cachedResponse = cacheKEys.find((x) => {
          //     if (x.url === request.url) {
          //       isDuplicate = true;
          //       return x;
          //     }
          //     if (x.url.split("?")[0] === request.url.split("?")[0]) {
          //       return x;
          //     }
          //   });
          //   if (isDuplicate) {
          //     console.log("skipped");
          //     return null;
          //   }
          //   const isCacheDeleted = await openedCache.delete(cachedResponse);
          //   console.log(isCacheDeleted, cachedResponse);
          //   //  }
          //   return response;
          // },
          cacheKeyWillBeUsed: async ({ request, response }) => {
            const modifiedUrl = request.url.replace(/\?_rsc=\w{5}/, "");
            //console.log(modifiedUrl);
            return modifiedUrl;
          },
        },
      ],
      expiration: {
        maxEntries: 1000,
        maxAgeSeconds: 24 * 60 * 60 * 30, // 24 hours
      },
    },
  },
  {
    urlPattern: /\.(?:json|xml|csv)$/i,
    handler: "NetworkFirst",
    options: {
      cacheName: "static-data-assets",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },
  {
    urlPattern: ({ url }) => {
      const isSameOrigin = self.origin === url.origin;
      if (!isSameOrigin) return false;
      const pathname = url.pathname;
      // Exclude /api/auth/callback/* to fix OAuth workflow in Safari without impact other environment
      // Above route is default for next-auth, you may need to change it if your OAuth workflow has a different callback route
      // Issue: https://github.com/shadowwalker/next-pwa/issues/131#issuecomment-821894809
      if (pathname.startsWith("/api/auth/")) return false;
      if (pathname.startsWith("/api/")) return true;
      return false;
    },
    handler: "NetworkFirst",
    method: "GET",
    options: {
      cacheName: "apis",
      expiration: {
        maxEntries: 16,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
      networkTimeoutSeconds: 10, // fall back to cache if api does not response within 10 seconds
    },
  },
  {
    urlPattern: ({ url }) => {
      const isSameOrigin = self.origin === url.origin;
      if (!isSameOrigin) return false;
      const pathname = url.pathname;
      if (pathname.startsWith("/api/")) return false;
      return true;
    },
    handler: "NetworkFirst",
    options: {
      cacheName: "others",
      expiration: {
        maxEntries: 2000,
        maxAgeSeconds: 24 * 60 * 60 * 30, // 1 month
      },
      networkTimeoutSeconds: 10,
    },
  },
  {
    urlPattern: ({ url }) => {
      const isSameOrigin = self.origin === url.origin;
      return !isSameOrigin;
    },
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "cross-origin",
      expiration: {
        maxEntries: 10000,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 1 month
      },
      // networkTimeoutSeconds: 10
    },
  },
];

// "CacheFirst"

// ,
// "CacheOnly"

// ,
// "NetworkFirst"

// ,
// "NetworkOnly"

// , or
// "StaleWhileRevalidate"

// workbox.routing.registerRoute(
//   /\.(?:webp|png|jpg|jpeg|svg)$/,
//   async ({url, event, params}) => {
//     const staleWhileRevalidate = new workbox.strategies.StaleWhileRevalidate();

//     try {
//       const response = await caches.match(event.request) || await fetch(url, { method: 'GET' });
//       if (!response || response.status === 404) {
//         throw new Error(response.status);
//       } else {
//         return await staleWhileRevalidate.handle({event});
//       }

//     } catch (error) {
//       console.warn(`\nServiceWorker: Image [${url.href}] was not found either in the network or the cache. Responding with placeholder image instead.\n`);
//       // * get placeholder image from cache || get placeholder image from network
//       return await caches.match(placeholderImageURL) || await fetch(placeholderImageURL, { method: 'GET' });

//     }
//   }
// );
