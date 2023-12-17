import type { Metadata } from "next";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "bootstrap/dist/css/bootstrap.css";
import type { AppProps } from "next/app";
import { Fragment } from "react";
import { AppWrapper } from "@/components/AppWrapper/AppWrapper";
import { AppProvider } from "@/contexts/AppContext";
import "@/css/dark-mode.css";
import "@/css/default.css";
import "@/css/fs-breakpoint-n.css";
import "@/css/global.css";
import "pure-react-carousel/dist/react-carousel.es.css";
import { Helper } from "@/utils/helper";
import { url } from "inspector";
config.autoAddCss = false;

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_ENVIRONMENT === "Local"
      ? "http://localhost:3001"
      : Helper.getBaseDomainServerSide()
  ),
  authors: {
    name: "Osama Almas Rahman",
    url: "https://github.com/aidotaosm",
  },
  robots: "index, follow",
  // icons: { // this gets replaced by file based icons thus need further investigation for this to work
  //   shortcut: "/images/android-chrome-192x192.png",
  //   other: { rel: "mask-icon", url: "/images/safari-pinned-tab.svg" },
  // },
  title: "NextGen Pokemon TCG V2",
  description:
    "The Next Generation Pokemon cards database. Fastest Pokemon card search experience out there! And with offline support!",
  openGraph: {
    type: "website",
    title: "NextGen Pokemon TCG",
    description:
      "The Next Generation Pokemon cards database. Fastest Pokemon card search experience out there! And with offline support!",
    images: [
      { url: "/images/pokemon_tcg_base_image.webp", width: 1200, height: 627 },
    ],
    url: Helper.getBaseDomainServerSide(),
    siteName: "The Next Generation Pokemon TCG database",
  },
  twitter: {
    title: "NextGen Pokemon TCG",
    description:
      "The Next Generation Pokemon cards database. Fastest Pokemon card search experience out there! And with offline support!",
    images: {
      url: "/images/pokemon_tcg_base_image.webp",
      width: 1200,
      height: 627,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={""}>
        <AppProvider>
          <AppWrapper>{children}</AppWrapper>
        </AppProvider>
      </body>
    </html>
  );
}
