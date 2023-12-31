import {
  useEffect,
  useState,
  FunctionComponent,
  useRef,
  Fragment,
} from "react";
import { DEFAULT_PAGE_SIZE } from "../../constants/constants";
import styles from "./PagingComponent.module.css";
import { IF } from "../UtilityComponents/IF";

interface PagingComponentProps {
  paramPageIndex: number;
  paramPageSize?: number;
  paramNumberOfElements: number;
  pageChanged: (e: number) => Promise<void>;
  syncPagingReferences: (e: number) => void;
  pageNumber: number;
  children?: any;
  isLoading: boolean;
  disabled?: boolean;
  bottomScroll?: boolean;
}

export const PagingComponent: FunctionComponent<PagingComponentProps> = ({
  paramPageIndex,
  paramPageSize = DEFAULT_PAGE_SIZE,
  paramNumberOfElements,
  pageChanged,
  syncPagingReferences,
  pageNumber,
  children,
  isLoading = false,
  disabled = false,
  bottomScroll = false,
}) => {
  const [pageIndex, setPageIndex] = useState<number>(paramPageIndex);
  const [pageSize, setPageSize] = useState<number>(paramPageSize);
  const [numberOfElements, setNumberOfElements] = useState<number>(
    paramNumberOfElements
  );
  const inputElementRef = useRef<any>();

  const cardsPagingOnClick = (newPageIndex: number) => {
    if (newPageIndex != pageIndex && !isLoading && !disabled) {
      if (newPageIndex >= 0) {
        let lastPage = Math.floor((numberOfElements - 1) / pageSize);
        if (newPageIndex > lastPage) {
          setPageIndex(lastPage);
          inputElementRef.current.value = lastPage + 1;
          refUpdated();
          if (pageIndex !== lastPage) {
            pageChanged(lastPage);
            if (bottomScroll) {
              window.scrollTo(0, 0);
            }
          }
        } else {
          pageChanged(newPageIndex);
          if (bottomScroll) {
            window.scrollTo(0, 0);
          }
          inputElementRef.current.value = newPageIndex + 1;
          refUpdated();
        }
      } else if (newPageIndex < 0) {
        inputElementRef.current.value = 1;
        refUpdated();
        if (pageIndex !== 0) {
          pageChanged(0);
          if (bottomScroll) {
            window.scrollTo(0, 0);
          }
        }
      }
    }
  };
  const refUpdated = () => {
    syncPagingReferences(inputElementRef?.current?.value || 1);
  };
  useEffect(() => {
    setPageIndex(paramPageIndex);
    setNumberOfElements(paramNumberOfElements);
    setPageSize(paramPageSize);
    if (inputElementRef?.current?.value) {
      inputElementRef.current.value = pageNumber || 1;
    }
  }, [paramPageIndex, paramNumberOfElements, paramPageSize, pageNumber]);

  const getPagingInfo = () => {
    let returnVal = "";
    let from = pageIndex * pageSize + 1;
    let to = (pageIndex + 1) * pageSize;
    if (to > numberOfElements) {
      to = numberOfElements;
    }
    returnVal += from + " to " + to + " of " + numberOfElements;
    return returnVal;
  };

  return (
    <>
      <Fragment>{children}</Fragment>
      <IF condition={numberOfElements > pageSize}>
        <div className="col-8 d-flex justify-content-center justify-content-md-end">
          <div className="d-flex flex-column">
            <ul className="pagination mb-2 ">
              <li className="page-item cursor-pointer">
                <span
                  className="page-link user-select-none border-0"
                  style={{ padding: "0.2rem 0.5rem" }}
                  onClick={() => cardsPagingOnClick(pageIndex - 1)}
                >
                  Previous
                </span>
              </li>
              <li
                className={
                  "page-item cursor-pointer border ms-1 " +
                  styles["without-child-page-link"]
                }
                style={{ borderRadius: "0.25rem" }}
              >
                <input
                  title="paging field"
                  aria-labelledby="paging field"
                  className={styles["style-less-input"] + " cursor-pointer"}
                  type="number"
                  onBlur={(e) => cardsPagingOnClick(+e.target.value - 1)}
                  defaultValue={pageIndex + 1}
                  onFocus={(e) => e.target.select()}
                  ref={inputElementRef}
                  onKeyDown={(e) => {
                    if (e.key == "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                  style={{ width: "1.6rem" }}
                />
              </li>
              <li className={"page-item " + styles["without-child-page-link"]}>
                of
              </li>
              <li className={"page-item " + styles["without-child-page-link"]}>
                {Math.ceil(numberOfElements / pageSize)}
              </li>
              <li className="page-item cursor-pointer user-select-none">
                <span
                  className="page-link border-0 ms-1"
                  onClick={() => cardsPagingOnClick(pageIndex + 1)}
                  style={{ padding: "0.2rem 0.5rem" }}
                >
                  Next
                </span>
              </li>
            </ul>
            <div className="align-self-center fw-light">{getPagingInfo()}</div>
          </div>
        </div>
      </IF>
    </>
  );
};
