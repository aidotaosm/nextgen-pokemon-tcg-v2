import { Helper } from "@/utils/helper";
import { Metadata } from "next";

export const baseMetaData: Metadata = {
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
  icons: {
    // this gets replaced by file based icons
    shortcut: "images/android-chrome-192x192.png",
    apple: {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "images/apple-touch-icon.png",
    },
    icon: [
      { rel: "favicon", url: "images/favicon.ico", type: "image/x-icon" },
      {
        rel: "icon",
        url: "images/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "images/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "images/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
    ],
  },
  title: "NextGen Pokemon TCG V2",
  description:
    "The Next Generation Pokemon cards database. Fastest Pokemon card search experience out there! And with offline support!",
  openGraph: {
    type: "website",
    title: "NextGen Pokemon TCG",
    description:
      "The Next Generation Pokemon cards database. Fastest Pokemon card search experience out there! And with offline support!",
    images: [
      { url: "images/pokemon_tcg_base_image.webp", width: 1200, height: 627 },
    ],
    url: Helper.getBaseDomainServerSide(),
    siteName: "The Next Generation Pokemon TCG database",
  },
  twitter: {
    title: "NextGen Pokemon TCG",
    description:
      "The Next Generation Pokemon cards database. Fastest Pokemon card search experience out there! And with offline support!",
    images: {
      url: "images/pokemon_tcg_base_image.webp",
      width: 1200,
      height: 627,
    },
  },
};
