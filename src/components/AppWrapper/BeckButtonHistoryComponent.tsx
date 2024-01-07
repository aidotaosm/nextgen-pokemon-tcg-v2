import { usePathname, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";

export const BeckButtonHistoryComponent = ({
  setListOfPaths,
  setPathToRedirect,
  listOfPaths,
}: {
  setListOfPaths: Dispatch<SetStateAction<string[]>>;
  setPathToRedirect: (param: string) => void;
  listOfPaths: string[];
}) => {
  let pathname = usePathname();
  const queryParams = useSearchParams();
  useEffect(() => {
    if (pathname) {
      if (pathname.includes("/series") || pathname === "/") {
        setListOfPaths((l) => [
          ...l,
          pathname +
            (queryParams?.get("opened-series")
              ? "?opened-series=" + queryParams?.get("opened-series")
              : ""),
        ]);
      }
      let splitPath = pathname.split("/")[1];
      if (!splitPath) {
        setPathToRedirect("");
      } else if (splitPath === "series") {
        setPathToRedirect("/");
      } else if (
        splitPath === "set" ||
        splitPath === "card" ||
        splitPath === "search"
      ) {
        if (
          (listOfPaths.length &&
            listOfPaths[listOfPaths.length - 1] != pathname) ||
          ""
        ) {
          setPathToRedirect(listOfPaths[listOfPaths.length - 1]);
        } else {
          setPathToRedirect("/");
        }
      }
    }
  }, [pathname, queryParams?.get("opened-series")]);
  return <></>;
};
