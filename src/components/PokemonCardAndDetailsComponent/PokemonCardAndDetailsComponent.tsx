'use client'
import { Fragment, FunctionComponent, useContext } from "react";
import { defaultBlurImage } from "@/base64Images/base64Images";
import { AppContext } from "../../contexts/AppContext";
import { PokemonDetailProps } from "../../models/GenericModels";
import { ImageComponent } from "../ImageComponent/ImageComponent";
import { PokemonDetailComponent } from "../PokemonDetailComponent/PokemonDetailComponent";
import { IF } from "../UtilityComponents/IF";

export const PokemonCardAndDetailsComponent: FunctionComponent<
  PokemonDetailProps
> = ({
  card,
  cardClicked = () => { },
  detailsClasses = "mt-5 mt-lg-0 ms-lg-5 flex-grow-1",
  showHQImage = false,
  showCardOpenToNewTab = true,
  imageClasses = "",
}) => {
    const { appState } = useContext(AppContext);
    return (
      <Fragment>
        <IF condition={!appState.offLineMode}>
          <div
            className={"pokemon-card-image " + imageClasses}
            onClick={(e) => {
              // e.stopPropagation();
              cardClicked(card);
            }}
          >
            <div className="special-card-wrapper p-0">
              <div
                className={
                  "special-card-border " + (!showHQImage ? "cursor-pointer" : "")
                }
                onContextMenu={(e) => {
                  if (!showHQImage) {
                    e.preventDefault();
                  }
                }}
                data-bs-toggle={!showHQImage ? "modal" : undefined}
                data-bs-target={
                  !showHQImage ? "#list-view-card-modal" : undefined
                }
              >
                <ImageComponent
                  src={card?.images?.small}
                  highQualitySrc={showHQImage ? card?.images?.large : null}
                  alt={card.name}
                  width={245}
                  height={342}
                  blurDataURL={defaultBlurImage}
                  className={
                    "rounded special-card position-relative h-100 w-100 " +
                    (showHQImage ? "" : "disable-save")
                  }
                />
              </div>
            </div>
          </div>
        </IF>
        <PokemonDetailComponent
          card={card}
          classes={detailsClasses}
          showCardOpenToNewTab={showCardOpenToNewTab}
        />
      </Fragment>
    );
  };
