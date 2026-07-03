import { withSerwist } from "@serwist/turbopack";

// ===== OLD next-pwa config (pre Next.js 16) — kept for reference only =====
// const customRuntimeCaching = require("./src/utils/customRuntimeCaching");
// const { PHASE_PRODUCTION_BUILD } = require("next/constants");
// module.exports = (phase, { defaultConfig }) => {
//   //console.log(defaultConfig, "defaultConfig");
//   /**
//    * @type {import('next').NextConfig}
//    */
//   const config = {
//     ...defaultConfig,
//     reactStrictMode: true,
//     swcMinify: true,
//     images: {
//       remotePatterns: [{ protocol: "https", hostname: "images.pokemontcg.io" }],
//       minimumCacheTTL: 60 * 60 * 24 * 30 * 12,
//     },
//     //  api: {
//     //     responseLimit: false,
//     // },
//     staticPageGenerationTimeout: 1000,
//     compiler: {
//       removeConsole:
//         process.env.NEXT_PUBLIC_APP_ENVIRONMENT !== "local" &&
//         process.env.NODE_ENV !== "development",
//     },
//     dest: "public",
//     dynamicStartUrl: false, // precache home page instead of storing it in runtime cache by default
//     disable: process.env.NODE_ENV === "development",
//     //  disable: true,
//     register: true,
//     skipWaiting: true,
//     extendDefaultRuntimeCaching: true,
//     workboxOptions: {
//       maximumFileSizeToCacheInBytes: 50000000,
//       runtimeCaching: [...customRuntimeCaching],
//       // exclude: [/media\/.*$/],
//     },
//     fallbacks: {
//       image: "/images/Cardback.webp",
//     },
//     cacheStartUrl: true,
//     reloadOnOnline: true,
//   };

//   if (phase === PHASE_PRODUCTION_BUILD) {
//     // Attributes generateBuildId and additionalManifestEntries are only needed
//     // for the build and calculating their value is time-consuming.
//     // So we add them here, just for the build.
//     const getBuildId = require("./src/utils/buildid.js");
//     const getStaticPrecacheEntries = require("./src/utils/staticprecache.js");

//     config.generateBuildId = getBuildId;
//     config.workboxOptions.additionalManifestEntries = [
//       ...getStaticPrecacheEntries({
//         // exclude icon-related files from the precache since they are platform specific
//         // note: no need to pass publicExcludes to next-pwa, it's not used for anything else
//         publicExcludes: [
//           "!noprecache/**/*",
//           "!sitemap.xml",
//           "!robots.txt",
//           "!images/pokemon_tcg_base_image.webp",
//           "!images/expansions_image.jpg",
//           // "!customRuntimeCaching.js",
//           "!antd.min.css",
//         ],
//       }),
//     ];
//   }
//  // console.log(config, "configconfig");
//   return require("@ducanh2912/next-pwa").default(config)();
// };

// const withPWA = require("@ducanh2912/next-pwa").default({
//   dest: "public",
//   disable: process.env.NODE_ENV === "development",
//
//   register: true,
//   skipWaiting: true,
//   extendDefaultRuntimeCaching: true,
//   workboxOptions: {
//     maximumFileSizeToCacheInBytes: 50000000,
//     runtimeCaching: [...customRuntimeCaching],
//     //ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^_rsc$/, /^opened-series$/],
//     // exclude: [/media\/.*$/],
//   },
//   fallbacks: {
//     image: "/images/Cardback.webp",
//   },
//
//   reloadOnOnline: true,
//   publicExcludes: [
//     "!noprecache/**/*",
//     "!sitemap.xml",
//     "!robots.txt",
//     "!images/pokemon_tcg_base_image.webp",
//     "!images/expansions_image.jpg",
//     "!antd.min.css",
//     "!images/Cardback.webp", // if we do not add this, this gets cached twice because of fallbacks: {image: "/images/Cardback.webp"} and breaks the SW
//     "!images/screenshot1.png",
//     "!images/screenshot2.png",
//   ],
//   //dynamicStartUrl: false, // precache home page instead of storing it in runtime cache by default
//   //cacheStartUrl: true,
// });
// ===== END OLD next-pwa config =====

/**
 * New PWA setup uses Serwist (@serwist/turbopack), which supports Next.js 16 + Turbopack.
 * - Service worker source:  src/app/sw.ts (runtime caching ported from customRuntimeCaching.js)
 * - Route handler:          src/app/serwist/[path]/route.ts (compiles + serves /serwist/sw.js)
 * - Registration + offline reload: <SerwistProvider> in src/app/layout.tsx
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.pokemontcg.io" }],
    minimumCacheTTL: 60 * 60 * 24 * 30 * 12,
  },
  staticPageGenerationTimeout: 60,
  compiler: {
    removeConsole:
      process.env.NEXT_PUBLIC_APP_ENVIRONMENT !== "local" &&
      process.env.NODE_ENV !== "development",
  },
};

export default withSerwist(nextConfig);
