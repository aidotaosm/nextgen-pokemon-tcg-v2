import { Fragment, FunctionComponent, useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import { CarouselProps } from "../../models/GenericModels";
import { ImageComponent } from "../ImageComponent/ImageComponent";
export const CarouselComponent: FunctionComponent<CarouselProps> = ({
  classes = "",
  children,
  isLandingPage = false,
}) => {
  const { appState } = useContext(AppContext);
  return (
    <div
      id="modal-carousel-HQ-cards"
      className={
        "carousel slide " +
        (!appState.darkMode && isLandingPage ? "carousel-dark" : "")
      }
      data-bs-ride="false"
      data-bs-interval="false"
    >
      <div className="carousel-inner">{children}</div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#modal-carousel-HQ-cards"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#modal-carousel-HQ-cards"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};
