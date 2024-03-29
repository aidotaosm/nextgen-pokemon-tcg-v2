import React, {
  Fragment,
  FunctionComponent,
  useContext,
  useEffect,
} from "react";
import {
  ButtonBack,
  ButtonNext,
  DotGroup,
  Slide,
  Slider,
} from "pure-react-carousel";
import { CarouselContext } from "pure-react-carousel";
import useWindowSize from "../../hooks/windowSize";
import Link from "next/link";
import { ImageComponent } from "../ImageComponent/ImageComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleLeft,
  faCircleChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { defaultBlurImage } from "@/base64Images/base64Images";
interface CarouselSliderProps {
  setSlideCount: (num: number) => void;
  setCurrentSlide: (num: number) => void;
  setCards: any[];
  carouselLoadingDone: boolean;
  setCarouselLoadingDone: (num: boolean) => void;
}

const CarouselSlider: FunctionComponent<CarouselSliderProps> = ({
  setSlideCount,
  carouselLoadingDone,
  setCurrentSlide,
  setCards,
  setCarouselLoadingDone,
}) => {
  const screenWidth = useWindowSize();

  //pure-react-carousel context
  const carouselContext = useContext(CarouselContext);

  useEffect(() => {
    const updateCarouselSlide = (slideToBeVisible: number) => {
      const { currentSlide, totalSlides, visibleSlides } =
        carouselContext.state;
      setSlideCount(slideToBeVisible);

      //this is a fix to reset currentSlide when screen resizes
      if (
        currentSlide >= totalSlides - visibleSlides ||
        currentSlide >= totalSlides - slideToBeVisible
      ) {
        setCurrentSlide(totalSlides - slideToBeVisible);
      }
    };
    if (screenWidth <= 575) {
      updateCarouselSlide(1);
    } else if (screenWidth <= 767) {
      updateCarouselSlide(2);
    } else if (screenWidth <= 991) {
      updateCarouselSlide(3);
    } else if (screenWidth <= 1199) {
      updateCarouselSlide(4);
    } else if (screenWidth <= 1399) {
      updateCarouselSlide(4);
    } else {
      updateCarouselSlide(5);
    }
    if (screenWidth) {
      setCarouselLoadingDone(false);
    }
  }, [screenWidth]);

  return (
    <Fragment>
      <Slider style={{ gap: "2rem" }}>
        {setCards?.map((card: any, index: number) => (
          <Slide
            index={index}
            key={card.id}
            className={"img-hover-zoom--quick-zoom"}
          >
            <Link
              href={"/card/" + card.id}
              style={{ maxWidth: "25rem" }}
              className=""
              // prefetch={
              //   typeof window === "undefined" ? false : navigator.onLine
              // }
            >
              <ImageComponent
                src={card?.images?.small}
                highQualitySrc={card?.images?.large}
                alt={card.name}
                width={734}
                height={1024}
                blurDataURL={defaultBlurImage}
                className="h-100 w-100"
                lqEagerLoading={"eager"}
                //lqImageUnOptimize={false}
                //hqEagerLoading={"lazy"}
              />
            </Link>
          </Slide>
        ))}
      </Slider>
      <div
        className={"controls mt-3 " + (carouselLoadingDone ? "invisible" : "")}
      >
        <ButtonBack className="btn-arrow ">
          <FontAwesomeIcon icon={faChevronCircleLeft} size="2x" />
        </ButtonBack>
        <DotGroup className="dot-group" />
        <ButtonNext className="btn-arrow">
          <FontAwesomeIcon icon={faCircleChevronRight} size="2x" />
        </ButtonNext>
      </div>
    </Fragment>
  );
};

export default CarouselSlider;
