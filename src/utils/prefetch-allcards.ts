import { IPFS_ALLCARDS_JSON_URL } from "./../constants/constants";
import { getAllCardsJSONFromFileBaseIPFS } from "./networkCalls";
export const triggerAllCardsPreCache = async (
  callbackSuccess?: Function,
  callbackFailed?: Function
) => {
  let openedCache = await caches.open("cross-origin");
  let cacheKEys = await openedCache.keys();
  const cachedResponse = cacheKEys.find((x) => {
    console.log(x);
    if (x.url === IPFS_ALLCARDS_JSON_URL) {
      return x;
    }
  });
  if (!cachedResponse) {
    console.log("all cards cache not found - preloading");
    getAllCardsJSONFromFileBaseIPFS()
      .then((x) => {
        //precache all cards for maxAgeSeconds: 24 * 60 * 60 * 30, // 1 month
        if (typeof callbackSuccess === "function") {
          callbackSuccess();
        }
      })
      .catch((x) => {
        if (typeof callbackFailed === "function") {
          callbackFailed();
        }
      });
  } else {
    if (typeof callbackSuccess === "function") {
      callbackSuccess();
    }
  }
};
