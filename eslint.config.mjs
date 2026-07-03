import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/**",
      "next-env.d.ts",
      // Serwist service worker (compiled by esbuild, uses worker globals)
      "src/app/sw.ts",
      // Vendored/legacy declaration + next-pwa helper scripts kept for reference
      "src/types/service-worker.d.ts",
      "src/utils/customRuntimeCaching.js",
      "src/utils/staticprecache.js",
      "src/utils/buildid.js",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // Pragmatic rules for this codebase (heavy, intentional use of `any`).
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      "@typescript-eslint/no-wrapper-object-types": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      // React Compiler-aware hints — surfaced as warnings, not build blockers.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
    },
  },
];

export default eslintConfig;
