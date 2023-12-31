const customRuntimeCaching = require("./public/customRuntimeCaching");
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  //  disable: true,
  register: true,
  skipWaiting: true,
  runtimeCaching: [...customRuntimeCaching],
  fallbacks: {
    image: "/images/Cardback.webp",
    fallbacks:'/offline'
  },
  maximumFileSizeToCacheInBytes: 50000000,
  reloadOnOnline: false,
  buildExcludes: [/media\/.*$/],
  publicExcludes: [
    "!noprecache/**/*",
    "!sitemap.xml",
    "!robots.txt",
    "!images/pokemon_tcg_base_image.webp",
    "!images/expansions_image.jpg",
    "!customRuntimeCaching.js",
    "!antd.min.css",
  ],
  //   publicExcludes: ['!manifest.webmanifest', '!images/favicon-16x16.png', '!images/favicon-32x32.png', '!images/safari-pinned-tab.svg', '!images/android-chrome-192x192.png', '!images/android-chrome-512x512.png', '!images/apple-touch-icon.png', '!favicon.ico']
});
module.exports = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.pokemontcg.io" }],
    minimumCacheTTL: 60 * 60 * 24 * 30 * 12,
  },
  //  api: {
  //     responseLimit: false,
  // },
  staticPageGenerationTimeout: 1000,
  compiler: {
    removeConsole:
      process.env.NEXT_PUBLIC_APP_ENVIRONMENT !== "local" && process.env.NODE_ENV !== "development",
  },
  experimental: {
    windowHistorySupport: true,
  },
  //  transpilePackages: ['antd']
  // target: 'serverless'
});

// "CacheFirst"

// ,
// "CacheOnly"

// ,
// "NetworkFirst"

// ,
// "NetworkOnly"

// , or
// "StaleWhileRevalidate"
