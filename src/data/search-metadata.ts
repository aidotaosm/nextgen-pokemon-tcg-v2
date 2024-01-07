import { Helper } from "@/utils/helper";
import { Metadata } from "next";

export const searchMetaData: Metadata = {
  title: "Fastest Pokemon card search!",
  description: "Search through all Pokemon cards ever printed, fast!",
  openGraph: {
    title: "Fastest Pokemon card search!",
    description: "Search through all Pokemon cards ever printed, fast!",
    images: [{ url: "/images/pokemon_tcg_base_image.webp" }],
    url: Helper.getBaseDomainServerSide() + "search",
  },
  twitter: {
    title: "Fastest Pokemon card search!",
    description: "Search through all Pokemon cards ever printed, fast!",
    images: {
      url: "/images/pokemon_tcg_base_image.webp",
    },
  },
};
