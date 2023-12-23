import { ExpansionsComponent } from "@/components/ExpansionsComponent/ExpansionsComponent";
import { seriesMetaData } from "@/data/series-metadata";
import { SeriesArrayProps } from "@/models/GenericModels";
import { getExpansions } from "@/utils/networkCalls";
import { Metadata } from "next";
import { Fragment, FunctionComponent } from "react";

async function getArrayOfSeries() {
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

  return { arrayOfSeries, totalNumberOfSets };
}

export const metadata: Metadata = seriesMetaData;
const Series: FunctionComponent = async () => {
  const { arrayOfSeries, totalNumberOfSets } = await getArrayOfSeries();
  return (
    <Fragment>
      <ExpansionsComponent
        arrayOfSeries={arrayOfSeries}
        totalNumberOfSets={totalNumberOfSets}
      />
    </Fragment>
  );
};
export default Series;
