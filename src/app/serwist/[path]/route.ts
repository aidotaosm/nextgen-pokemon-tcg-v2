import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createSerwistRoute } from "@serwist/turbopack";

// A revision versions the precached fallback pages so stale responses are not
// served after a deploy. Fall back to a random id if git is unavailable.
const revision =
  spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout?.trim() ||
  randomUUID();

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    swSrc: "src/app/sw.ts",
    // Precache the offline document fallback (an app route, not a public file so
    // it is not auto-precached). `/images/Cardback.webp` is a public file and is
    // already included in the auto-generated precache manifest, so it must NOT be
    // added here — doing so causes an "add-to-cache-list-conflicting-entries" error.
    // Note: disabling the SW in development is handled client-side by the
    // <SerwistProvider disable> prop in src/app/layout.tsx.
    additionalPrecacheEntries: [{ url: "/~offline", revision }],
    useNativeEsbuild: true,
  });
