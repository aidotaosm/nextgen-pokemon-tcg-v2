import { Helper } from "@/utils/helper";
import { Metadata } from "next";

export const seriesMetaData: Metadata = {
  title: "Pokemon TCG Expansions",
  description: "Browse through all the Pokemon TCG expansions!",
  openGraph: {
    title: "Pokemon TCG Expansions",
    description: "Browse through all the Pokemon TCG expansions!",
    images: [{ url: "images/expansions_image.jpg" }],
    url: Helper.getBaseDomainServerSide() + "series",
  },
  twitter: {
    title: "Pokemon TCG Expansions",
    description: "Browse through all the Pokemon TCG expansions!",
    images: {
      url: "images/expansions_image.jpg",
    },
  },
};
