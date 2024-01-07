import { DEFAULT_PAGE_SIZE } from "@/constants/constants";
import { SortOptions, SortOrderOptions } from "@/data";
import {
  FilterFieldNames,
  ValidHPRange,
  ValidRetreatCostRange,
} from "@/models/Enums";
import { getAllCardsJSONFromFileBaseIPFS } from "@/utils/networkCalls";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";
import energyTypes from "../../InternalJsons/AllTypes.json";
import subTypes from "../../InternalJsons/AllSubtypes.json";
import rarities from "../../InternalJsons/AllRarities.json";
import regulationMarks from "../../InternalJsons/AllRegulationMarks.json";
import allSetNames from "../../InternalJsons/AllSetNames.json";
import superTypes from "../../InternalJsons/AllSuperTypes.json";
import { FormInstance } from "antd";
import { AppContext } from "@/contexts/AppContext";
export const SetOnLoadComponent = ({
  isSearchPage,
  formInstance,
  cardsObject,
  pageChanged,
  pageIndex,
  setSearchValue,
  setAllCardsFromNetwork,
}: {
  isSearchPage: boolean;
  formInstance: FormInstance<any>;
  cardsObject: any;
  pageChanged: (
    newPageIndex: number,
    paramSearchValue?: string,
    textSearchValue?: string,
    instantFilterValues?: any,
    allCardsResponse?: any[]
  ) => Promise<void>;
  pageIndex: number;
  setSearchValue: (param: string) => void;
  setAllCardsFromNetwork: (param: any) => void;
}) => {
  const { appState } = useContext(AppContext);
  const queryParams = useSearchParams();
  useEffect(() => {
    const filterCardsOnLoad = (paramAllCardsREsponse?: any[]) => {
      let routerPageIndex = 0;
      const fieldValues: any = {};
      for (const [key, value] of queryParams?.entries() || []) {
        fieldValues[key] = value;
      }
      const filterNames = Object.keys(fieldValues);
      let correctedFieldValues: any = {};
      filterNames.forEach((fieldName) => {
        if (fieldValues[fieldName]) {
          const fieldValue = fieldValues[fieldName];
          switch (fieldName) {
            case FilterFieldNames.energyType:
              if (fieldValue) {
                let TypedFieldValue = fieldValue.split(",") as string[];
                correctedFieldValues[fieldName] = [];
                TypedFieldValue.forEach((energy) => {
                  if (energyTypes.includes(energy)) {
                    correctedFieldValues[fieldName].push(energy);
                  }
                });
              }
              break;
            case FilterFieldNames.weakness:
              if (fieldValue) {
                let TypedFieldValue = fieldValue.split(",") as string[];
                correctedFieldValues[fieldName] = [];
                TypedFieldValue.forEach((weakness) => {
                  if (energyTypes.includes(weakness)) {
                    correctedFieldValues[fieldName].push(weakness);
                  }
                });
              }
              break;
            case FilterFieldNames.resistance:
              if (fieldValue) {
                let TypedFieldValue = fieldValue.split(",") as string[];
                correctedFieldValues[fieldName] = [];
                TypedFieldValue.forEach((resistance) => {
                  if (energyTypes.includes(resistance)) {
                    correctedFieldValues[fieldName].push(resistance);
                  }
                });
              }
              break;
            case FilterFieldNames.regulationMarks:
              if (fieldValue.length) {
                let TypedFieldValue = fieldValue.split(",") as string[];
                correctedFieldValues[fieldName] = [];
                TypedFieldValue.forEach((regulationMark) => {
                  if (regulationMarks.includes(regulationMark)) {
                    correctedFieldValues[fieldName].push(regulationMark);
                  }
                });
              }
              break;
            case FilterFieldNames.set:
              if (fieldValue.length && isSearchPage) {
                let TypedFieldValue = fieldValue.split(",") as string[];
                correctedFieldValues[fieldName] = [];
                TypedFieldValue.forEach((setId) => {
                  if (allSetNames.find((x) => x[0] === setId)) {
                    correctedFieldValues[fieldName].push(setId);
                  }
                });
              }
              break;
            case FilterFieldNames.subType:
              if (fieldValue.length) {
                let TypedFieldValue = fieldValue.split(",") as string[];
                correctedFieldValues[fieldName] = [];
                TypedFieldValue.forEach((subType) => {
                  if (subTypes.includes(subType)) {
                    correctedFieldValues[fieldName].push(subType);
                  }
                });
              }
              break;
            case FilterFieldNames.rarity:
              if (fieldValue.length) {
                let TypedFieldValue = fieldValue.split(",") as string[];
                correctedFieldValues[fieldName] = [];
                TypedFieldValue.forEach((rarity) => {
                  if (rarities.includes(rarity)) {
                    correctedFieldValues[fieldName].push(rarity);
                  }
                });
              }
              break;
            case FilterFieldNames.hpRange:
              if (fieldValue) {
                let TypedFieldValue = fieldValue.split(",") as string[];
                correctedFieldValues[fieldName] = [];
                TypedFieldValue.forEach((hp) => {
                  if (ValidHPRange.max >= +hp && ValidHPRange.min <= +hp) {
                    correctedFieldValues[fieldName].push(+hp);
                  }
                });
              }
              break;
            case FilterFieldNames.retreatCost:
              if (fieldValue) {
                let TypedFieldValue = fieldValue.split(",") as string[];
                correctedFieldValues[fieldName] = [];
                TypedFieldValue.forEach((retreatCost) => {
                  if (
                    ValidRetreatCostRange.max >= +retreatCost &&
                    ValidRetreatCostRange.min <= +retreatCost
                  ) {
                    correctedFieldValues[fieldName].push(+retreatCost);
                  }
                });
              }
              break;
            case FilterFieldNames.cardType:
              if (fieldValue.length) {
                let TypedFieldValue = fieldValue.split(",") as string[];
                correctedFieldValues[fieldName] = [];
                TypedFieldValue.forEach((cardType) => {
                  if (superTypes.includes(cardType)) {
                    correctedFieldValues[fieldName].push(cardType);
                  }
                });
              }
              break;
            case FilterFieldNames.textSearch:
              if (fieldValue) {
                let TypedFieldValue = fieldValue as string;
                correctedFieldValues[fieldName] = TypedFieldValue;
              }
              break;
            case FilterFieldNames.sortLevelOne:
              if (fieldValue) {
                let TypedFieldValue = fieldValue as string;
                correctedFieldValues[fieldName] = "";
                if (Object.keys(SortOptions).includes(TypedFieldValue)) {
                  correctedFieldValues[fieldName] = TypedFieldValue;
                }
              }
              break;
            case FilterFieldNames.sortLevelOneOrder:
              if (fieldValue) {
                let TypedFieldValue = fieldValue as string;
                correctedFieldValues[fieldName] = "";
                if (Object.keys(SortOrderOptions).includes(TypedFieldValue)) {
                  correctedFieldValues[fieldName] = TypedFieldValue;
                }
              }
              break;
          }
        }
      });
      const pageFromQuery = queryParams?.get("page");
      const searchKeyFromQuery = queryParams?.get("search");
      const filterInQueryExists = Object.keys(correctedFieldValues).length;
      if (filterInQueryExists) {
        formInstance.setFieldsValue(correctedFieldValues);
      }
      let tempTotalCount = isSearchPage
        ? paramAllCardsREsponse?.length
        : cardsObject.totalCount;
      if (
        pageFromQuery &&
        !isNaN(+pageFromQuery) &&
        !isNaN(parseFloat(pageFromQuery.toString()))
      ) {
        if ((+pageFromQuery + 1) * DEFAULT_PAGE_SIZE > tempTotalCount) {
          let lastPage = Math.floor(tempTotalCount / DEFAULT_PAGE_SIZE);
          routerPageIndex = lastPage;
        } else {
          routerPageIndex = +pageFromQuery;
        }
      }
      let searchTerm = "";
      if (searchKeyFromQuery && typeof searchKeyFromQuery === "string") {
        searchTerm = searchKeyFromQuery;
      }
      if (appState.globalSearchTerm) {
        searchTerm = appState.globalSearchTerm;
      }
      if (
        routerPageIndex !== pageIndex ||
        searchTerm ||
        filterInQueryExists ||
        isSearchPage
      ) {
        pageChanged(
          routerPageIndex,
          searchTerm,
          undefined,
          correctedFieldValues,
          paramAllCardsREsponse
        );
        setSearchValue(searchTerm);
      }
    };
    if (cardsObject || isSearchPage) {
      if (isSearchPage) {
        getAllCardsJSONFromFileBaseIPFS()
          .then((allCardsResponse) => {
            setAllCardsFromNetwork(allCardsResponse);
            filterCardsOnLoad(allCardsResponse);
          })
          .catch((e) => {
            console.log(e, "allCardsResponse error");
          });
      } else {
        filterCardsOnLoad();
      }
    }
  }, []);

  return <></>;
};
