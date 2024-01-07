import SetComponent from "@/components/SetComponent/SetComponent";
import { maxPokeDexNumber } from "@/constants/constants";
import { SpecialSetNames } from "@/models/Enums";
import { Props } from "@/models/GenericModels";
import { Helper } from "@/utils/helper";
import { getAllSetCards, getExpansions } from "@/utils/networkCalls";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
export let revalidate = 60 * 60 * 24;
export const dynamicParams = true;
export const generateStaticParams = async () => {
  const { arrayOfSeries, sets } = await getExpansions();
  let returnPaths: { setId: string }[] = [];
  // let allSetIds: string[] = dynamicallyImportedAllCards.map(
  //   (x: any) => x.set.id
  // );
  // let uniqueItems: string[] = Array.from(new Set(allSetIds));
  // returnPaths = uniqueItems.map((x) => {
  //   return {
  //     params: {
  //       setId: x,
  //     },
  //   };
  // });
  arrayOfSeries.forEach((series) => {
    series.sets.forEach((set: any) => {
      if (set.id === SpecialSetNames.pop2) {
        set.id = SpecialSetNames.poptwo; // this is done because pop2 is blocked by ad blocker
      }
      returnPaths.push({ setId: set.id });
    });
  });
  console.log(returnPaths);
  if (process.env.NEXT_PUBLIC_APP_ENVIRONMENT == "Local") {
    returnPaths.splice(1, returnPaths.length - 1);
  }
  // process.env.NODE_ENV
  return returnPaths;
};

const getSetOnServer = cache(async (setId: string) => {
  // this is done because pop2 is blocked by ad blocker
  let correctedSetId =
    setId == SpecialSetNames.poptwo ? SpecialSetNames.pop2 : setId;
  const cardsObject = await getAllSetCards(correctedSetId);
  // const setCards = dynamicallyImportedAllCards.filter((x: any) => {
  //   if (x.set.id === correctedSetId) {
  //     return x;
  //   }
  // });
  // const cardsObject = {
  //   data: setCards,
  //   totalCount: setCards.length,
  // };
  //console.log(cardsObject, setId, "cardsObject");
  if (cardsObject?.data?.length) {
    (cardsObject.data as any[]).sort(
      (firstColumn, secondColumn) =>
        (firstColumn.nationalPokedexNumbers?.[0] || maxPokeDexNumber) -
        (secondColumn.nationalPokedexNumbers?.[0] || maxPokeDexNumber)
    );
  }
  return cardsObject;
});

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  const cardsObject = await getSetOnServer(params.setId);
  const title = cardsObject?.data[0].set.name;
  const description =
    title + " set from the " + cardsObject?.data?.[0]?.set?.series + " series";

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [{ url: cardsObject?.data[0].set?.images?.logo }],
      url:
        Helper.getBaseDomainServerSide() +
        "set/" +
        (cardsObject?.data?.[0]?.set?.id == SpecialSetNames.pop2
          ? SpecialSetNames.poptwo
          : cardsObject?.data?.[0]?.set?.id),
    },
    twitter: {
      title: title,
      description: description,
      images: {
        url: cardsObject?.data[0].set?.images?.logo,
      },
    },
  };
}

const SetDetails = async ({ params }: Props) => {
  const cardsObject = await getSetOnServer(params.setId);
  if (!cardsObject?.data?.length) {
    notFound();
  }
  return (
    <>
      <SetComponent cardsObject={cardsObject} />
    </>
  );
};
export default SetDetails;
