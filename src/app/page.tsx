import HomePageClientComponent from "@/components/HomePageClientComponent/HomePageClientComponent";
import { Helper } from "@/utils/helper";
import { getAllCardsJSONFromFileBaseIPFS } from "@/utils/networkCalls";
import { getArrayOfSeries } from "@/utils/seriesNetworkCall";
import { cache } from "react";

export const revalidate = 60 * 60 * 24;

const getTenRandomCards = cache(async () => {
  let tenRandomCards = [];
  try {
    let allCardsResponse: any[] = await getAllCardsJSONFromFileBaseIPFS();

    for (let i = 0; i < 10; i++) {
      let randomIndex = Helper.randDelay(0, allCardsResponse.length - 1);
      tenRandomCards.push(allCardsResponse[randomIndex]);
    }
  } catch (e) {
    console.log(e, "getAllCardsJSONFromFileBaseIPFS error");
  }
  return { setCards: tenRandomCards };
});

const HomePage = async () => {
  const promiseResponse = await Promise.all([
    getTenRandomCards(),
    getArrayOfSeries(),
  ]);
  const { setCards } = promiseResponse[0];
  const { arrayOfSeries, totalNumberOfSets } = promiseResponse[1];
  return (
    <HomePageClientComponent setCards={setCards} arrayOfSeries={arrayOfSeries}totalNumberOfSets={totalNumberOfSets}></HomePageClientComponent>
  );
};
export default HomePage;
