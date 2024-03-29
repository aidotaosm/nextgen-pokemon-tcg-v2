"use client";
import {
  FunctionComponent,
  Suspense,
  useContext,
  useEffect,
  useState,
} from "react";
import { PagingComponent } from "../PagingComponent/PagingComponent";
import {
  DEFAULT_PAGE_SIZE,
  maxHP,
  maxPokeDexNumber,
  Vercel_DEFAULT_URL,
} from "../../constants/constants";
import { CardsObjectProps } from "../../models/GenericModels";

import { IF } from "../UtilityComponents/IF";
import { GridViewComponent } from "../GridViewComponent/GridViewComponent";
import { ListOrGridViewToggle } from "../UtilityComponents/ListOrGridViewToggle";
import { ListViewComponent } from "../ListViewComponent/ListViewComponent";
import { AppContext } from "../../contexts/AppContext";
import { ImageComponent } from "../ImageComponent/ImageComponent";
import { logoBlurImage } from "@/base64Images/base64Images";
import { LocalSearchComponent } from "../LocalSearchComponent/LocalSearchComponent";
import { getCardsFromNextServer } from "../../utils/networkCalls";
import { SidebarFiltersComponent } from "../SidebarFiltersComponent/SidebarFiltersComponent";
import { Form } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBarsStaggered } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "bootstrap/js/dist/tooltip";
import { FilterFieldNames } from "../../models/Enums";
import superTypes from "../../InternalJsons/AllSuperTypes.json";
import { SortOptions, SortOrderOptions } from "../../data";
import { Helper } from "../../utils/helper";
import { useParams } from "next/navigation";
import { SetOnLoadComponent } from "./SetOnLoadComponent";

const SetComponent: FunctionComponent<CardsObjectProps> = ({
  cardsObject,
  isSearchPage = false,
}) => {
  const [formInstance] = Form.useForm();
  const paths = useParams();
  const getCardsForServerSide = () => {
    let from = 0 * DEFAULT_PAGE_SIZE;
    let to = (0 + 1) * DEFAULT_PAGE_SIZE;
    let changedSetOfCards: any[] | null = null;
    if (!isSearchPage) {
      changedSetOfCards = cardsObject?.data.slice(from, to);
    }
    return changedSetOfCards;
  };
  const [totalCount, setTotalCount] = useState<number>(
    cardsObject?.totalCount || 0
  );
  const [allCardsFromNetwork, setAllCardsFromNetwork] = useState<any[]>([]);
  const [setCards, setSetCards] = useState<any>(getCardsForServerSide());
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [refPageNumber, setRefPageNumber] = useState<number>(0);
  const {
    appState,
    updateGridView,
    updateGlobalSearchTerm,
    updateSidebarCollapsed,
  } = useContext(AppContext);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const filterButtonTooltipId = "filterButtonTooltipId";

  const getUpdatedView = (view: boolean) => {
    updateGridView?.(view);
  };

  useEffect(() => {
    let bootStrapMasterClass = appState?.bootstrap;
    const filterButtonTrigger = document.getElementById(
      filterButtonTooltipId
    ) as any;
    let filterTooltipInstance: Tooltip;
    if (bootStrapMasterClass && filterButtonTrigger) {
      filterTooltipInstance = new bootStrapMasterClass.Tooltip(
        filterButtonTrigger
      );
    }

    return () => {
      filterTooltipInstance?.dispose();
    };
  }, [appState?.bootstrap]);

  useEffect(() => {
    return () => {
      updateGlobalSearchTerm?.("");
    };
  }, []);
  //console.log(setCards);
  const handleSearchAndFilter = (
    paramSearchValue: string | undefined,
    textSearchValue: string | undefined,
    initialCards: any[],
    newPageIndex: number,
    instantFilterValues?: any
  ) => {
    let tempSearchValue: string =
      paramSearchValue === "" || paramSearchValue
        ? paramSearchValue
        : searchValue;
    let tempTextSearchValue: string =
      textSearchValue === "" || textSearchValue
        ? textSearchValue
        : formInstance.getFieldsValue()?.[FilterFieldNames.textSearch];
    let tempChangedCards: any[] = initialCards.filter((item: any) => {
      return item.name
        .toLowerCase()
        .includes(tempSearchValue.toLowerCase().trim());
    });
    const fieldValues = instantFilterValues || formInstance.getFieldsValue();
    const filterNames = Object.keys(fieldValues);
    filterNames.forEach((fieldName) => {
      if (fieldValues[fieldName]) {
        const fieldValue = fieldValues[fieldName];
        switch (fieldName) {
          case FilterFieldNames.energyType:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string[];
              TypedFieldValue.forEach((energy) => {
                tempChangedCards = tempChangedCards.filter((card: any) => {
                  return (
                    card.types && (card.types as string[]).includes(energy)
                  );
                });
              });
            }
            break;
          case FilterFieldNames.weakness:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string[];
              TypedFieldValue.forEach((weakness) => {
                tempChangedCards = tempChangedCards.filter((card: any) => {
                  return (
                    card.weaknesses &&
                    (card.weaknesses as { type: string; value: string }[]).find(
                      (weaknessObject) => weaknessObject.type === weakness
                    )
                  );
                });
              });
            }
            break;
          case FilterFieldNames.resistance:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string[];
              TypedFieldValue.forEach((resistance) => {
                tempChangedCards = tempChangedCards.filter((card: any) => {
                  return (
                    card.resistances &&
                    (
                      card.resistances as { type: string; value: string }[]
                    ).find(
                      (resistanceObject) => resistanceObject.type === resistance
                    )
                  );
                });
              });
            }
            break;
          case FilterFieldNames.regulationMarks:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string[];
              let regulationMarks: any[] = [];
              TypedFieldValue.forEach((regulationMark) => {
                regulationMarks = [
                  ...regulationMarks,
                  ...tempChangedCards.filter((card: any) => {
                    return (
                      card.regulationMark &&
                      card.regulationMark === regulationMark
                    );
                  }),
                ];
              });
              tempChangedCards = regulationMarks.filter(
                (value, index, self) =>
                  self.findIndex((v) => v.id === value.id) === index
              );
            }
            break;
          case FilterFieldNames.set:
            if (fieldValue.length && isSearchPage) {
              let TypedFieldValue = fieldValue as string[];
              let setResult: any[] = [];
              TypedFieldValue.forEach((setId) => {
                setResult = [
                  ...setResult,
                  ...tempChangedCards.filter((card: any) => {
                    return card.set.id === setId;
                  }),
                ];
              });
              tempChangedCards = setResult.filter(
                (value, index, self) =>
                  self.findIndex((v) => v.id === value.id) === index
              );
            }
            break;
          case FilterFieldNames.textSearch:
            if (fieldValue) {
              let TypedFieldValue = tempTextSearchValue.toLowerCase() as string;
              tempChangedCards = tempChangedCards.filter((card: any) => {
                return (
                  card.attacks?.find(
                    (attack: { name: string; text: string }) =>
                      attack.name.toLowerCase().includes(TypedFieldValue) ||
                      attack.text?.toLowerCase().includes(TypedFieldValue)
                  ) ||
                  card.abilities?.find(
                    (ability: { name: string; text: string }) =>
                      ability.name.toLowerCase().includes(TypedFieldValue) ||
                      ability.text?.toLowerCase().includes(TypedFieldValue)
                  ) ||
                  card.rules?.find((rule: string) =>
                    rule.toLowerCase().includes(TypedFieldValue)
                  )
                );
              });
            }
            break;
          case FilterFieldNames.subType:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string[];
              let subTypeResult: any[] = [];
              TypedFieldValue.forEach((subtype) => {
                subTypeResult = [
                  ...subTypeResult,
                  ...tempChangedCards.filter((card: any) => {
                    return (
                      card.subtypes &&
                      (card.subtypes as string[]).includes(subtype)
                    );
                  }),
                ];
              });
              tempChangedCards = subTypeResult.filter(
                (value, index, self) =>
                  self.findIndex((v) => v.id === value.id) === index
              );
            }
            break;
          case FilterFieldNames.rarity:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string[];
              let subTypeResult: any[] = [];
              TypedFieldValue.forEach((rarity) => {
                subTypeResult = [
                  ...subTypeResult,
                  ...tempChangedCards.filter((card: any) => {
                    return card.rarity === rarity;
                  }),
                ];
              });
              tempChangedCards = subTypeResult.filter(
                (value, index, self) =>
                  self.findIndex((v) => v.id === value.id) === index
              );
            }
            break;
          case FilterFieldNames.hpRange:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as number[];
              tempChangedCards = tempChangedCards.filter((card: any) => {
                return (
                  (card.hp &&
                    (+card.hp as number) >= TypedFieldValue[0] &&
                    (+card.hp as number) <= TypedFieldValue[1]) ||
                  card.supertype !== superTypes[1]
                );
              });
            }
            break;
          case FilterFieldNames.retreatCost:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as number[];
              tempChangedCards = tempChangedCards.filter((card: any) => {
                return (
                  (card.convertedRetreatCost &&
                    (+card.convertedRetreatCost as number) >=
                      TypedFieldValue[0] &&
                    (+card.convertedRetreatCost as number) <=
                      TypedFieldValue[1]) ||
                  (card.supertype === superTypes[1] &&
                    card.convertedRetreatCost === undefined &&
                    TypedFieldValue[0] === 0) ||
                  card.supertype !== superTypes[1]
                );
              });
            }
            break;
          case FilterFieldNames.cardType:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string[];
              let cardTypeResult: any[] = [];
              TypedFieldValue.forEach((cardType) => {
                cardTypeResult = [
                  ...cardTypeResult,
                  ...tempChangedCards.filter((card: any) => {
                    return card.supertype === cardType;
                  }),
                ];
              });
              tempChangedCards = cardTypeResult;
            }
            break;
          case FilterFieldNames.sortLevelOne:
            if (fieldValue) {
              let TypedFieldValue = fieldValue as keyof typeof SortOptions;
              if (TypedFieldValue === "sortByDexNumber") {
                tempChangedCards.sort(
                  (firstColumn, secondColumn) =>
                    (firstColumn.nationalPokedexNumbers?.[0] ||
                      maxPokeDexNumber) -
                    (secondColumn.nationalPokedexNumbers?.[0] ||
                      maxPokeDexNumber)
                );
              } else if (TypedFieldValue === "sortByHP") {
                tempChangedCards.sort(
                  (firstColumn, secondColumn) =>
                    (+firstColumn.hp || maxHP) - (+secondColumn.hp || maxHP)
                );
              } else if (TypedFieldValue === "sortByName") {
                tempChangedCards.sort((firstColumn, secondColumn) =>
                  firstColumn.name.localeCompare(secondColumn.name)
                );
              } else if (TypedFieldValue === "energyType") {
                tempChangedCards.sort((firstColumn, secondColumn) => {
                  let comparisonResult = 0;
                  if (firstColumn.types?.[0] && secondColumn.types?.[0]) {
                    comparisonResult = firstColumn.types[0].localeCompare(
                      secondColumn.types[0]
                    );
                  } else if (firstColumn.types?.[0]) {
                    comparisonResult = firstColumn.types[0];
                  } else if (secondColumn.types?.[0]) {
                    comparisonResult = secondColumn.types[0];
                  } else {
                    comparisonResult = maxPokeDexNumber;
                  }

                  return comparisonResult;
                });
              } else if (TypedFieldValue === "releaseDate") {
                tempChangedCards.sort((firstColumn, secondColumn) =>
                  new Date(firstColumn.set.releaseDate) >
                  new Date(secondColumn.set.releaseDate)
                    ? 1
                    : new Date(firstColumn.set.releaseDate) ===
                      new Date(secondColumn.set.releaseDate)
                    ? 0
                    : -1
                );
              }
            }
            break;
          case FilterFieldNames.sortLevelOneOrder:
            if (fieldValue) {
              let TypedFieldValue = fieldValue as keyof typeof SortOrderOptions;
              if (TypedFieldValue === "asc") {
                // tempChangedCards.reverse();
              } else if (TypedFieldValue === "desc") {
                tempChangedCards.reverse();
              }
            }
            break;
        }
      }
    });
    let from = newPageIndex * DEFAULT_PAGE_SIZE;
    let to = (newPageIndex + 1) * DEFAULT_PAGE_SIZE;
    //cards of the day
    // Helper.saveTemplateAsFile(
    //   "CardsOfTheDay.json",
    //   tempChangedCards.slice(
    //     tempChangedCards.length - 11,
    //     tempChangedCards.length - 1
    //   )
    // );

    // unique cards
    // let listOfCardsWithUniqueNames = Array.from(new Set(tempChangedCards.map((card: any) => card.name)));
    // Helper.saveTemplateAsFile("AllCardsWithUniqueNames.json", listOfCardsWithUniqueNames);

    // unique sets
    // let listOfUniqueSets = Array.from(new Map(tempChangedCards.map(item => [item.set.id, item.set.name])));
    // Helper.saveTemplateAsFile("AllSetNames.json", listOfUniqueSets);

    setSetCards(tempChangedCards.slice(from, to));
    setTotalCount(tempChangedCards.length);
    setPageIndex(newPageIndex);
    updateRouteWithQuery(newPageIndex, tempSearchValue, instantFilterValues);
    setRefPageNumber(newPageIndex + 1);
  };

  const pageChanged = async (
    newPageIndex: number,
    paramSearchValue?: string,
    textSearchValue?: string,
    instantFilterValues?: any,
    allCardsResponse?: any[]
  ) => {
    if (isSearchPage) {
      setIsLoading(true);
      try {
        // if (!appState.darkMode && navigator.onLine) {
        if (false) {
          let tempSearchValue: string | undefined =
            paramSearchValue === "" || paramSearchValue
              ? paramSearchValue
              : searchValue;
          let cardsParentObject = await getCardsFromNextServer(
            newPageIndex,
            tempSearchValue
          );
          setSetCards(cardsParentObject.data);
          setTotalCount(cardsParentObject.totalCount);
          setPageIndex(newPageIndex);
          updateRouteWithQuery(newPageIndex, tempSearchValue);
          setRefPageNumber(newPageIndex + 1);
          setIsLoading(false);
        } else {
          // import("../../InternalJsons/AllCards.json").then(
          //   (allCardsModule) => {
          //     if (allCardsModule.default) {
          //       try {
          //         let allCardsFromCache = allCardsModule.default as any[];
          //         //YYYY-MM-DD
          //         // const xmlText = Helper.generateSiteMap(allCardsFromCache, Vercel_DEFAULT_URL + 'card/');
          //         // Helper.saveTemplateAsFile(
          //         //   "sitemap.xml",
          //         //   xmlText,
          //         //   false,
          //         //   "text/plain"
          //         // );
          //         handleSearchAndFilter(
          //           paramSearchValue,
          //           allCardsFromCache,
          //           newPageIndex,
          //           instantFilterValues
          //         );
          //         setIsLoading(false);
          //       } catch (e) {
          //         console.log(e);
          //         setIsLoading(false);
          //       }
          //     }
          //   }
          // );
          let allCardsFromCache = allCardsResponse || allCardsFromNetwork;
          handleSearchAndFilter(
            paramSearchValue,
            textSearchValue,
            allCardsFromCache,
            newPageIndex,
            instantFilterValues
          );
          setIsLoading(false);
        }
      } catch (e) {
        setIsLoading(false);
      }
    } else {
      handleSearchAndFilter(
        paramSearchValue,
        textSearchValue,
        cardsObject.data,
        newPageIndex,
        instantFilterValues
      );
    }
  };

  const updateRouteWithQuery = (
    newPageIndex: number,
    searchValue?: string,
    instantFilterValues?: any
  ) => {
    const fieldValues = instantFilterValues || formInstance.getFieldsValue();
    const filterNames = Object.keys(fieldValues);
    let filterQuery = "";
    filterNames.forEach((fieldName) => {
      if (fieldValues[fieldName]) {
        const fieldValue = fieldValues[fieldName];
        switch (fieldName) {
          case FilterFieldNames.energyType:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string[];
              TypedFieldValue.join(",");
              filterQuery += "&" + fieldName + "=" + TypedFieldValue;
            }
            break;
          case FilterFieldNames.weakness:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string[];
              TypedFieldValue.join(",");
              filterQuery += "&" + fieldName + "=" + TypedFieldValue;
            }
            break;
          case FilterFieldNames.resistance:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string[];
              TypedFieldValue.join(",");
              filterQuery += "&" + fieldName + "=" + TypedFieldValue;
            }
            break;
          case FilterFieldNames.regulationMarks:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string[];
              TypedFieldValue.join(",");
              filterQuery += "&" + fieldName + "=" + TypedFieldValue;
            }
            break;
          case FilterFieldNames.set:
            if (fieldValue.length && isSearchPage) {
              let TypedFieldValue = fieldValue as string[];
              TypedFieldValue.join(",");
              filterQuery += "&" + fieldName + "=" + TypedFieldValue;
            }
            break;
          case FilterFieldNames.subType:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string[];
              TypedFieldValue.join(",");
              filterQuery += "&" + fieldName + "=" + TypedFieldValue;
            }
            break;
          case FilterFieldNames.rarity:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string[];
              TypedFieldValue.join(",");
              filterQuery += "&" + fieldName + "=" + TypedFieldValue;
            }
            break;
          case FilterFieldNames.hpRange:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as number[];
              TypedFieldValue.join(",");
              filterQuery += "&" + fieldName + "=" + TypedFieldValue;
            }
            break;
          case FilterFieldNames.retreatCost:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as number[];
              TypedFieldValue.join(",");
              filterQuery += "&" + fieldName + "=" + TypedFieldValue;
            }
            break;
          case FilterFieldNames.cardType:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string[];
              TypedFieldValue.join(",");
              filterQuery += "&" + fieldName + "=" + TypedFieldValue;
            }
            break;
          case FilterFieldNames.textSearch:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string;
              filterQuery += "&" + fieldName + "=" + TypedFieldValue;
            }
            break;
          case FilterFieldNames.sortLevelOne:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string;
              filterQuery += "&" + fieldName + "=" + TypedFieldValue;
            }
            break;
          case FilterFieldNames.sortLevelOneOrder:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string;
              filterQuery += "&" + fieldName + "=" + TypedFieldValue;
            }
            break;
        }
      }
    });

    let updatedQuery =
      (isSearchPage ? "/search" : "/set/" + paths?.setId) +
      (newPageIndex || searchValue || filterQuery
        ? "?" +
          (newPageIndex ? "&page=" + newPageIndex : "") +
          (searchValue ? "&search=" + searchValue : "") +
          filterQuery
        : "");
    const fixedQuery = updatedQuery.replaceAll("?&", "?");
    // router.push(fixedQuery);
    window.history.pushState({}, "", fixedQuery);
  };

  const setSearchValueFunction = (
    value: string,
    eventType: "onChange" | "submit"
  ) => {
    setSearchValue(value);
    if (
      (!isLoading && isSearchPage && eventType === "submit") ||
      !isSearchPage
    ) {
      pageChanged(0, value);
    }
  };
  const syncPagingReferences = (pageNumber: number) => {
    setRefPageNumber(pageNumber);
  };

  const triggerFilter = (textSearchValue?: string) => {
    pageChanged(0, undefined, textSearchValue);
  };
  const hideAllTollTips = () => {
    let bootStrapMasterClass = appState?.bootstrap;
    if (bootStrapMasterClass) {
      const filterButtonTooltipInstance: Tooltip =
        bootStrapMasterClass.Tooltip.getInstance("#" + filterButtonTooltipId);
      filterButtonTooltipInstance?.hide();
    }
  };

  const resetFilters = () => {
    setSearchValue("");
    formInstance.resetFields();
    pageChanged(0, "", "");
  };

  if (false) {
    //router.isFallback this is not necessary or possible in approuter - depricated
    return (
      <div className="container d-flex flex-grow-1 justify-content-center">
        <h1 className="align-self-center">Set Loading...</h1>
      </div>
    );
  } else {
    return (
      <>
        <div className="container d-flex flex-column" onClick={hideAllTollTips}>
          <div
            className="d-flex justify-content-center mb-4 align-items-center"
            style={{ height: "5rem", minHeight: "5rem", overflow: "hidden" }}
          >
            <IF condition={isSearchPage}>
              <h1 className="h4">
                Fastest Pokemon card search experience out there!
              </h1>
            </IF>
            {!isSearchPage && (
              <>
                <div
                  className={
                    "position-relative w-100 " +
                    (!appState.offLineMode ? "d-block" : "d-none")
                  }
                  style={{ height: "5rem" }}
                >
                  <ImageComponent
                    src={cardsObject.data[0].set?.images?.logo}
                    alt={cardsObject.data[0].set.name}
                    shouldFill={true}
                    blurDataURL={logoBlurImage}
                    fallBackType="logo"
                    fallbackImage={"/images/International_Pokémon_logo.png"}
                  />
                </div>
                <h1
                  className={
                    "mb-0 ms-3 h4 " +
                    (appState.offLineMode ? "d-block" : "d-none")
                  }
                >
                  {cardsObject.data[0].set.name +
                    " set of " +
                    cardsObject.data[0].set.series}{" "}
                  series
                </h1>
              </>
            )}
          </div>
          <div className="mb-4 row row-cols-2 row-cols-md-3 buttons-wrapper">
            <div className="d-flex align-items-center col col-12 col-md-4 mb-4 mb-md-0">
              <div
                className="sidebar-trigger cursor-pointer"
                data-bs-title={"Show / Hide filters."}
                data-bs-toggle="tooltip"
                data-bs-trigger="hover"
                data-bs-placement="top"
                id={filterButtonTooltipId}
              >
                <IF condition={!appState.sidebarCollapsed}>
                  <FontAwesomeIcon
                    size="2x"
                    icon={faBarsStaggered}
                    onClick={(e) => {
                      updateSidebarCollapsed?.(!appState.sidebarCollapsed);
                    }}
                  />
                </IF>
                <IF condition={appState.sidebarCollapsed}>
                  <FontAwesomeIcon
                    size="2x"
                    icon={faBars}
                    onClick={(e) => {
                      updateSidebarCollapsed?.(!appState.sidebarCollapsed);
                    }}
                  />
                </IF>
              </div>
              <div className=" flex-grow-1 ms-2">
                <LocalSearchComponent
                  setSearchValueFunction={setSearchValueFunction}
                  defaultSearchTerm={searchValue}
                  initialPlaceHolder={
                    isSearchPage ? "Global search e.g. " : "Search in set e.g. "
                  }
                  disabled={isSearchPage && setCards === null}
                  setCards={isSearchPage ? null : cardsObject.data}
                />
              </div>
            </div>
            <PagingComponent
              pageChanged={pageChanged}
              paramPageSize={DEFAULT_PAGE_SIZE}
              paramNumberOfElements={totalCount}
              paramPageIndex={pageIndex}
              syncPagingReferences={syncPagingReferences}
              pageNumber={refPageNumber}
              isLoading={isLoading}
              disabled={isSearchPage && setCards === null}
            >
              <ListOrGridViewToggle
                isGridView={appState.gridView}
                getUpdatedView={getUpdatedView}
                additionalClasses={
                  totalCount > DEFAULT_PAGE_SIZE ? "col-4" : "col-12"
                }
              ></ListOrGridViewToggle>
            </PagingComponent>
          </div>
          <div
            className={
              "d-flex sidebar-content-wrapper h-100 " +
              (appState.sidebarCollapsed ? "collapsed" : "")
            }
          >
            <div className={"sidebar"}>
              <SidebarFiltersComponent
                resetFilters={resetFilters}
                setId={setCards?.[0]?.set?.id}
                isSearchPage={isSearchPage}
                formInstance={formInstance}
                triggerFilter={triggerFilter}
              />
            </div>
            <IF condition={appState.gridView}>
              <GridViewComponent setCards={setCards}></GridViewComponent>
            </IF>
            <IF condition={!appState.gridView}>
              <ListViewComponent setCards={setCards}></ListViewComponent>
            </IF>
          </div>
          <div className="mt-4 row row-cols-2 row-cols-md-3">
            <div className="col d-none d-md-block"></div>
            <PagingComponent
              pageChanged={pageChanged}
              paramPageSize={DEFAULT_PAGE_SIZE}
              paramNumberOfElements={totalCount}
              paramPageIndex={pageIndex}
              syncPagingReferences={syncPagingReferences}
              pageNumber={refPageNumber}
              isLoading={isLoading}
              disabled={isSearchPage && setCards === null}
              bottomScroll={true}
            >
              <ListOrGridViewToggle
                isGridView={appState.gridView}
                getUpdatedView={getUpdatedView}
                additionalClasses={
                  totalCount > DEFAULT_PAGE_SIZE ? "col-4" : "col-12"
                }
              ></ListOrGridViewToggle>
            </PagingComponent>
          </div>
        </div>
        <Suspense fallback={<></>}>
          <SetOnLoadComponent
            isSearchPage={isSearchPage}
            formInstance={formInstance}
            cardsObject={cardsObject}
            pageChanged={pageChanged}
            pageIndex={pageIndex}
            setSearchValue={setSearchValue}
            setAllCardsFromNetwork={setAllCardsFromNetwork}
          />
        </Suspense>
      </>
    );
  }
};
export default SetComponent;
