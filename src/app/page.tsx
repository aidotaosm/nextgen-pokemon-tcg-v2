import HomePageClientComponent from "@/components/HomePageClientComponent/HomePageClientComponent";
import { Helper } from "@/utils/helper";
import { getAllCardsJSONFromFileBaseIPFS } from "@/utils/networkCalls";
import { cache } from "react";

export const revalidate = 60 * 60 * 24;

const getTenRandomCards = cache(async () => {
  let tenRandomCards = [];
  console.log("getAllCardsJSONFromFileBaseIPFS attempted");
  try {
    let allCardsResponse: any[] = await getAllCardsJSONFromFileBaseIPFS();

    for (let i = 0; i < 10; i++) {
      let randomIndex = Helper.randDelay(0, allCardsResponse.length - 1);
      tenRandomCards.push(allCardsResponse[randomIndex]);
    }
    console.log("getAllCardsJSONFromFileBaseIPFS success");
  } catch (e) {
    console.log(e, "getAllCardsJSONFromFileBaseIPFS error");
  }
  console.log("getTenRandomCards");
  return { setCards: tenRandomCards };
});

const HomePage = async () => {
  const { setCards } = await getTenRandomCards();
  return <HomePageClientComponent setCards={setCards}></HomePageClientComponent>
};
export default HomePage;
