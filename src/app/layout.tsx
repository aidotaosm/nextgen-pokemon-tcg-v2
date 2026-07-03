import type { Metadata } from "next";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "bootstrap/dist/css/bootstrap.css";
import { AppWrapper } from "@/components/AppWrapper/AppWrapper";
import { AppProvider } from "@/contexts/AppContext";
import "@/css/dark-mode.css";
import "@/css/default.css";
import "@/css/fs-breakpoint-n.css";
import "@/css/global.css";
import "pure-react-carousel/dist/react-carousel.es.css";
import { baseMetaData } from "@/data/base-metadata";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SerwistProvider } from "@serwist/turbopack/react";

config.autoAddCss = false;

export const metadata: Metadata = baseMetaData;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className={""}>
        <SerwistProvider
          swUrl="/serwist/sw.js"
          reloadOnOnline={true}
          disable={process.env.NODE_ENV === "development"}
        >
          <AppProvider>
            <AppWrapper>{children}</AppWrapper>
          </AppProvider>
        </SerwistProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
