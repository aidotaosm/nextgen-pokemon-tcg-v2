import { CardComponent } from "@/components/CardComponent/CardComponent";
import { Props } from "@/models/GenericModels";
import { Helper } from "@/utils/helper";
import { getCardById } from "@/utils/networkCalls";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

export let revalidate = 60 * 60 * 24;
export const dynamicParams = true; // this is fallback true
export const generateStaticParams = async () => {
  return [];
};
const getCardOnServer = cache(async (cardId: string) => {
  const cardObject = await getCardById(cardId);
  console.log(cardObject,'cardObject');
  return cardObject;
});
export async function generateMetadata(
  { params }: Props<{ cardId: string }>,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  const cardObject = await getCardOnServer(params.cardId);
  if (!cardObject.id) {
    return {};
  }
  const title = cardObject.name + " - " + cardObject.set.name;
  const description =
    title + ", from the " + cardObject.set.series + " series.";

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [{ url: cardObject?.images?.large }],
      url: Helper.getBaseDomainServerSide() + "card/" + cardObject.id,
    },
    twitter: {
      title: title,
      description: description,
      images: {
        url: cardObject.images.large,
      },
    },
  };
}
const CardDetails = async ({ params }: Props<{ cardId: string }>) => {
  const cardObject = await getCardOnServer(params.cardId);
  if (!cardObject?.id) {
    notFound();
  }
  return (
    <>
      <CardComponent cardObject={cardObject} />
    </>
  );
};
export default CardDetails;
