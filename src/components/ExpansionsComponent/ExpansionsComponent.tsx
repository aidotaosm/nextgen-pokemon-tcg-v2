"use client";
import {
  Fragment,
  FunctionComponent,
  Suspense,
  useContext,
  useState,
} from "react";
import { SeriesArrayProps } from "../../models/GenericModels";
import styles from "./ExpansionsComponent.module.css";
import { ImageComponent } from "../ImageComponent/ImageComponent";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { logoBlurImage } from "@/base64Images/base64Images";
import { AppContext } from "../../contexts/AppContext";
import { SpecialSetNames } from "../../models/Enums";
import { LocalSearchComponent } from "../LocalSearchComponent/LocalSearchComponent";
import { PreloadComponent } from "../Preload/PreloadComponent";
import { AcordionToggleComponent } from "./AcordionToggleComponent";

export const ExpansionsComponent: FunctionComponent<SeriesArrayProps> = ({
  totalNumberOfSets,
  arrayOfSeries,
}: any) => {
  let router = useRouter();
  const { updateGlobalSearchTerm } = useContext(AppContext);
  const [setsBySeries, setSetsBySeries] = useState<any[]>(arrayOfSeries);
  const [searchValue, setSearchValue] = useState("");
  // console.log(appState?.bootstrap);

  const toggleAccordion = (seriesId: any) => {
    let allowScroll = false;
    setsBySeries.forEach((s: any) => {
      if (s.id !== seriesId) {
        if (s.isOpen) {
          (
            document.getElementById(s.id)?.children[0]
              .children[0] as HTMLElement
          )?.click();
        }
        s.isOpen = false;
      } else {
        s.isOpen = !s.isOpen;
        allowScroll = s.isOpen;
      }
    });
    if (allowScroll) {
      let newAccordionToOpen = document.getElementById(seriesId);
      setTimeout(() => {
        newAccordionToOpen?.scrollIntoView({
          behavior: "smooth",
          inline: "start",
          block: "start",
        });
      }, 500);
      window.history.pushState({}, "", "/series?opened-series=" + seriesId);
      //router.push("/series?opened-series=" + seriesId);
    } else {
      window.history.pushState({}, "", "/series");
      //router.push("/series");
    }
    setSetsBySeries([...setsBySeries]);
  };
  const setSearchValueFunction = (
    value: string,
    eventType: "onChange" | "submit"
  ) => {
    if (eventType === "submit") {
      updateGlobalSearchTerm?.(value || "");
      router.push("/search");
    }
    setSearchValue(value);
  };
  return (
    <Fragment>
      <div className="container">
        <div className="d-md-flex justify-content-between mb-4">
          <div className="mb-4 mb-md-0 search-wrapper">
            <LocalSearchComponent
              setSearchValueFunction={setSearchValueFunction}
              initialPlaceHolder={"Global search e.g. "}
              defaultSearchTerm={searchValue}
            />
          </div>
          <div className="ms-0 ms-md-4 d-flex justify-content-center justify-content-md-end align-items-center">
            <h1 className="me-4 mb-0 h4">All Pokemon TCG Expansions</h1>
            <PreloadComponent
              arrayOfSeries={arrayOfSeries}
              totalNumberOfSets={totalNumberOfSets}
            ></PreloadComponent>
          </div>
        </div>
        <div className="accordion">
          {setsBySeries.map((series, seriesIndex) => {
            return (
              <div
                className="accordion-item special-accordion-wrapper"
                key={series.id}
                id={series.id}
              >
                <h2
                  className="accordion-header  special-accordion-border special-accordion"
                  id={series.id + "-heading"}
                >
                  <button
                    className={
                      "accordion-button special-accordion py-2-2-5 px-3  " +
                      (seriesIndex === 0 ? "" : "collapsed")
                    }
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={"#" + series.id + "-series-id"}
                    aria-expanded="false"
                    aria-controls={series.id + "-series-id"}
                    onClick={(e) => {
                      if (e.isTrusted) {
                        toggleAccordion(series.id);
                      }
                    }}
                  >
                    <h2 className="fs-5 fw-bold mb-0">{series.series}</h2>
                  </button>
                </h2>
                <div
                  id={series.id + "-series-id"}
                  className={
                    "accordion-collapse collapse " +
                    (seriesIndex === 0 ? "show" : "")
                  }
                  aria-labelledby={series.id + "-heading"}
                >
                  <div className="accordion-body pb-2 pt-3">
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5 align-items-center">
                      {series.sets.map((set: any, setIndex: number) => {
                        return (
                          <Link
                            className={"col mb-2 " + styles.set}
                            key={set.id}
                            id={set.id}
                            //only the first 2 sets of each expansion are prefetched upon viewport entry
                            //prefetch={setIndex < 2 ? undefined : false}
                            //prefetch={true}
                            href={
                              // this is done because pop2 is blocked by ad blocker
                              "/set/" +
                              (set.id === SpecialSetNames.pop2
                                ? SpecialSetNames.poptwo
                                : set.id)
                            }
                            // prefetch={
                            //   typeof window === "undefined"
                            //     ? false
                            //     : navigator.onLine
                            // }
                          >
                            <>
                              <div className={styles["set-image"]}>
                                <ImageComponent
                                  src={set?.images?.logo}
                                  alt={set.name}
                                  height={72}
                                  width={192}
                                  blurDataURL={logoBlurImage}
                                  className="w-100 h-100"
                                  fallBackType="logo"
                                  fallbackImage={
                                    "/images/International_Pokémon_logo.png"
                                  }
                                />
                              </div>
                              <div className={styles["set-name"]}>
                                <span className="fw-bold me-2">{set.name}</span>
                                <ImageComponent
                                  src={set?.images?.symbol}
                                  alt={set?.name + " Symbol"}
                                  height={25}
                                  width={25}
                                  blurDataURL={logoBlurImage}
                                  className="disable-save set-symbol-in-expansions"
                                  fallBackType="symbol"
                                  fallbackImage={"/images/free-energy.png"}
                                />
                              </div>
                            </>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Suspense fallback={<></>}>
        <AcordionToggleComponent
          setSetsBySeries={setSetsBySeries}
          setsBySeries={setsBySeries}
        />
      </Suspense>
    </Fragment>
  );
};
