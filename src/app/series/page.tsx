import { ExpansionsComponent } from "@/components/ExpansionsComponent/ExpansionsComponent";
import { seriesMetaData } from "@/data/series-metadata";
import { getExpansions } from "@/utils/networkCalls";
import { getArrayOfSeries } from "@/utils/seriesNetworkCall";
import { Metadata } from "next";
import { Fragment, FunctionComponent, cache } from "react";
export const revalidate = 60 * 60;
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
