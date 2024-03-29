"use client";
import CarouselSlider from "@/components/CaouselSlider/CarouselSlider";
import { ImageComponent } from "@/components/ImageComponent/ImageComponent";
import { LocalSearchComponent } from "@/components/LocalSearchComponent/LocalSearchComponent";
import { AppContext } from "@/contexts/AppContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CarouselProvider } from "pure-react-carousel";
import { FunctionComponent, useContext, useState } from "react";
import swsh125 from "../../internal-images/Paradox-Rift-PTCG.webp";
import { PreloadComponent } from "../Preload/PreloadComponent";

const HomePageClientComponent: FunctionComponent<{
  setCards: any[];
  arrayOfSeries: any[];
  totalNumberOfSets: number;
}> = ({ setCards, arrayOfSeries, totalNumberOfSets }) => {
  const [searchValue, setSearchValue] = useState("");
  const [slideCount, setSlideCount] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselLoadingDone, setCarouselLoadingDone] = useState(true);
  const { updateGlobalSearchTerm } = useContext(AppContext);
  let router = useRouter();
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
    <div className="container d-flex flex-column justify-content-center">
      <h1 className="text-center h3 w-100 mb-3">NextGen Pokemon TCG</h1>
      <h2 className="text-center mb-4 mb-lg-5 text-muted h5 w-100">
        The Next Generation Pokemon cards database. Fastest Pokemon card search
        experience out there! And with offline support!
      </h2>
      <div className="d-block d-sm-flex align-items-center mb-4 mb-lg-5 w-100">
        <div className=" d-flex align-items-center mb-4 mb-sm-0 w-100 me-0 me-sm-3">
          <div className="w-100 h-100 d-flex align-items-center flex-sm-column justify-content-center flex-md-row">
            <div className="w-100 me-3 me-sm-0 me-md-3 flex-md-grow-1 mb-0 mb-sm-4 mb-md-0">
              <LocalSearchComponent
                setSearchValueFunction={setSearchValueFunction}
                initialPlaceHolder={"Global search e.g. "}
                defaultSearchTerm={searchValue}
              />
            </div>
            <PreloadComponent
              arrayOfSeries={arrayOfSeries}
              totalNumberOfSets={totalNumberOfSets}
            ></PreloadComponent>
          </div>
        </div>
        <Link
          href="/series"
          className="un-styled-anchor cursor-pointer d-block w-100"
          //prefetch={typeof window === "undefined" ? false : navigator.onLine}
        >
          <div className="special-card-border smaller-radius">
            <div className=" d-lg-flex align-items-center flex-column flex-lg-row justify-content-center border-light-gray rounded special-card position-relative bg-default">
              <div className="flex-grow-1 ms-lg-3 text-decoration-none d-block d-lg-none mb-lg-0 p-2">
                <h3 className="text-center h5">Browse Sets</h3>
                <p className="mb-0 text-center text-muted">
                  Browse all expansions of the Pokemon TCG, search and filter
                  through your desired cards and more!
                </p>
              </div>
              <div className="flex-shrink-0 media-image">
                <ImageComponent
                  src={swsh125}
                  alt={"Browse cards"}
                  className=" w-100 h-100 rounded"
                  lqImageUnOptimize={false}
                />
              </div>
              <div className="flex-grow-1 ms-lg-3 text-decoration-none d-none d-lg-block py-2 pe-2">
                <h3 className="h5">Browse Sets</h3>
                <p className="mb-0 text-muted">
                  Browse all expansions of the Pokemon TCG, search and filter
                  through your desired cards and more!
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
      <div className="w-100">
        <h3 className="mb-4 text-center h4">Today's Featured Cards!</h3>
        <div
          className={
            "carousel-container " +
            (carouselLoadingDone ? "carousel-loading" : "")
          }
        >
          <CarouselProvider
            hasMasterSpinner={carouselLoadingDone}
            visibleSlides={slideCount}
            totalSlides={setCards.length}
            step={1}
            currentSlide={currentSlide}
            naturalSlideWidth={100}
            naturalSlideHeight={125}
            isIntrinsicHeight={true}
            isPlaying={true}
            infinite={true}
          >
            <CarouselSlider
              setCarouselLoadingDone={setCarouselLoadingDone}
              carouselLoadingDone={carouselLoadingDone}
              setSlideCount={setSlideCount}
              setCurrentSlide={setCurrentSlide}
              setCards={setCards}
            />
          </CarouselProvider>
        </div>
      </div>
    </div>
  );
};
export default HomePageClientComponent;
