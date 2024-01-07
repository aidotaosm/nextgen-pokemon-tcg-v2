import SetComponent from "@/components/SetComponent/SetComponent";
import { searchMetaData } from "@/data/search-metadata";
import { Metadata } from "next";
export const metadata: Metadata = searchMetaData;
const SearchPage = async () => {

  return (
    <>
      <SetComponent isSearchPage={true} />
    </>
  );
};
export default SearchPage;
