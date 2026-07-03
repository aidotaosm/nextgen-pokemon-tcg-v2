import { FormInstance } from "antd";
import { ReactElement, ReactNode } from "react";

export class BasicProps {
  children?: ReactNode;
  qry?: any;
}
export class CardsObjectProps {
  children?: ReactElement;
  cardsObject?: any;
  isSearchPage?: boolean;
}
export class CardObjectProps {
  children?: ReactElement;
  cardObject?: any;
}

export class SetCardsProps {
  children?: ReactElement;
  setCards?: any;
}

export interface SeriesArrayProps {
  children?: ReactElement;
  arrayOfSeries?: any[];
  totalNumberOfSets: number;
}
export interface PokemonDetailProps {
  children?: ReactElement;
  card?: any;
  classes?: string;
  detailsClasses?: string;
  showHQImage?: boolean;
  showCardOpenToNewTab?: boolean;
  cardClicked?: (e: any) => void;
  imageClasses?: string;
}
export interface CarouselProps {
  children?: ReactElement;
  classes?: string;
  isLandingPage?: boolean;
}
export interface SidebarFiltersComponentProps {
  formInstance: FormInstance;
  triggerFilter: (textSearchValue?: string) => void;
  isSearchPage: boolean;
  setId: string;
  resetFilters: (textSearchValue?: string) => void;
}
export interface EnergyComponentProps {
  type: string;
  toolTipId: string;
}
export interface ExternalLinkProps {
  card?: any;
  classes?: string;
  toolTipId: string;
}
export interface ModalProps {
  primaryClasses?: string;
  children?: ReactElement;
  secondaryClasses?: string;
  id?: string;
  handleModalClose?: (e: any) => void;
  modalCloseButton?: any;
  hideFooter?: boolean;
  modalTitle?: string;
  hideHeader?: boolean;
  showOkButton?: boolean;
  okButtonText?: string;
  handleOkButtonPress?: (e: any) => void;
}
export type Props<T> = {
  params: Promise<T>;
};
