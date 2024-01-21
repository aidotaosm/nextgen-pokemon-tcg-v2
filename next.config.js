const customRuntimeCaching = require("./src/utils/customRuntimeCaching");
// const withPWA = require("@ducanh2912/next-pwa");
const { PHASE_PRODUCTION_BUILD } = require("next/constants");
module.exports = (phase, { defaultConfig }) => {
  //console.log(defaultConfig, "defaultConfig");
  /**
   * @type {import('next').NextConfig}
   */
  const config = {
    ...defaultConfig,
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
        process.env.NEXT_PUBLIC_APP_ENVIRONMENT !== "local" &&
        process.env.NODE_ENV !== "development",
    },
    dest: "public",
    dynamicStartUrl: false, // precache home page instead of storing it in runtime cache by default
    disable: process.env.NODE_ENV === "development",
    //  disable: true,
    register: true,
    skipWaiting: true,
    extendDefaultRuntimeCaching: true,
    workboxOptions: {
      maximumFileSizeToCacheInBytes: 50000000,
      runtimeCaching: [...customRuntimeCaching],
      // exclude: [/media\/.*$/],
    },
    fallbacks: {
      image: "/images/Cardback.webp",
      fallbacks: "/offline",
    },
    cacheStartUrl: true,
    reloadOnOnline: true,
  };

  if (phase === PHASE_PRODUCTION_BUILD) {
    // Attributes generateBuildId and additionalManifestEntries are only needed
    // for the build and calculating their value is time-consuming.
    // So we add them here, just for the build.
    const getBuildId = require("./src/utils/buildid.js");
    const getStaticPrecacheEntries = require("./src/utils/staticprecache.js");

    config.generateBuildId = getBuildId;
    config.workboxOptions.additionalManifestEntries = [
      ...getStaticPrecacheEntries({
        // exclude icon-related files from the precache since they are platform specific
        // note: no need to pass publicExcludes to next-pwa, it's not used for anything else
        publicExcludes: [
          "!noprecache/**/*",
          "!sitemap.xml",
          "!robots.txt",
          "!images/pokemon_tcg_base_image.webp",
          "!images/expansions_image.jpg",
          // "!customRuntimeCaching.js",
          "!antd.min.css",
        ],
      }),
    ];
  }
 // console.log(config, "configconfig");
  return require("@ducanh2912/next-pwa").default(config)();
};

// const withPWA = require("@ducanh2912/next-pwa").default({
//   dest: "public",
//   disable: process.env.NODE_ENV === "development",
//   //  disable: true,
//   register: true,
//   skipWaiting: true,
//   extendDefaultRuntimeCaching: true,
//   workboxOptions: {
//     maximumFileSizeToCacheInBytes: 50000000,
//     runtimeCaching: [...customRuntimeCaching],
//     // exclude: [/media\/.*$/],
//   },
//   fallbacks: {
//     image: "/images/Cardback.webp",
//     fallbacks: "/offline",
//   },
//   cacheStartUrl: true,
//   reloadOnOnline: false,
//   publicExcludes: [
//     "!noprecache/**/*",
//     "!sitemap.xml",
//     "!robots.txt",
//     "!images/pokemon_tcg_base_image.webp",
//     "!images/expansions_image.jpg",
//     // "!customRuntimeCaching.js",
//     "!antd.min.css",
//   ],
//   //   publicExcludes: ['!manifest.webmanifest', '!images/favicon-16x16.png', '!images/favicon-32x32.png', '!images/safari-pinned-tab.svg', '!images/android-chrome-192x192.png', '!images/android-chrome-512x512.png', '!images/apple-touch-icon.png', '!favicon.ico']
// });

// module.exports = withPWA({
//   reactStrictMode: true,
//   swcMinify: true,
//   images: {
//     remotePatterns: [{ protocol: "https", hostname: "images.pokemontcg.io" }],
//     minimumCacheTTL: 60 * 60 * 24 * 30 * 12,
//   },
//   //  api: {
//   //     responseLimit: false,
//   // },
//   staticPageGenerationTimeout: 1000,
//   compiler: {
//     removeConsole:
//       process.env.NEXT_PUBLIC_APP_ENVIRONMENT !== "local" &&
//       process.env.NODE_ENV !== "development",
//   },
//   // experimental: {
//   //   windowHistorySupport: true,
//   // },
//   //  transpilePackages: ['antd']
//   // target: 'serverless'
// });
