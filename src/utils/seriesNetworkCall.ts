import { cache } from "react";
import { getExpansions } from "./networkCalls";

export const getArrayOfSeries = cache(async () => {
    let { arrayOfSeries, sets } = await getExpansions();
    let totalNumberOfSets = 0;
    if (arrayOfSeries && arrayOfSeries[0]) {
      arrayOfSeries.sort(function (a, b) {
        let convertedA = new Date(a.releaseDate);
        let convertedB = new Date(b.releaseDate);
        return convertedB.getTime() - convertedA.getTime();
      });
      arrayOfSeries[0].isOpen = true;
      totalNumberOfSets = arrayOfSeries
        .map((series) => (totalNumberOfSets = series.sets.length))
        .reduce((partialSum, a) => partialSum + a, 0);
    }
   // console.log("getArrayOfSeries on the server");
    return { arrayOfSeries, totalNumberOfSets };
  });